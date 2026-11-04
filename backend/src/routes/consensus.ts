import { findLatestRubricVersionId } from '@lib/rubricVersion';
import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { isGeneralPathwayId, isPathwayId, resolvePathwayId } from '@shared/pathways';

const router = Router();

const SCORE_MIN = 0;
const SCORE_MAX = 4;
const RATING_TOOLTIP_MIN = 0;
const RATING_TOOLTIP_MAX = 4;
const JUSTIFICATION_PREVIEW_LENGTH = 120;
const AVERAGE_DECIMAL_FACTOR = 100;

type SessionUser = {
  id: string;
  role: string;
  institutionId: string | null;
};

function parseSessionUser(req: Request): SessionUser | null {
  if (!req.user) return null;
  const user = req.user as { id?: string; role?: string; institutionId?: string | null };
  if (!user.id || !user.role) return null;
  return {
    id: user.id,
    role: user.role,
    institutionId: user.institutionId ?? null,
  };
}

type LocalLeaderSession = SessionUser & { institutionId: string };

type ConsensusDataScope = {
  institutionId: string;
  role: 'LOCAL_LEADER' | 'PROJECT_LEAD';
};

function requireLocalLeaderWithInstitution(req: Request, res: Response): LocalLeaderSession | null {
  const sessionUser = parseSessionUser(req);
  if (!sessionUser) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  if (sessionUser.role !== 'LOCAL_LEADER') {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  if (!sessionUser.institutionId) {
    res.status(400).json({ error: 'College lead has no institution' });
    return null;
  }
  return { ...sessionUser, institutionId: sessionUser.institutionId };
}

function requireProjectLead(req: Request, res: Response): SessionUser | null {
  const sessionUser = parseSessionUser(req);
  if (!sessionUser) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  if (sessionUser.role !== 'PROJECT_LEAD') {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return sessionUser;
}

/** Institution used for histograms and assignment counts: session for College leads, query for project leads. */
async function resolveConsensusDataScope(
  req: Request,
  res: Response
): Promise<ConsensusDataScope | null> {
  const sessionUser = parseSessionUser(req);
  if (!sessionUser) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  if (sessionUser.role === 'LOCAL_LEADER') {
    if (!sessionUser.institutionId) {
      res.status(400).json({ error: 'College lead has no institution' });
      return null;
    }
    return { institutionId: sessionUser.institutionId, role: 'LOCAL_LEADER' };
  }
  if (sessionUser.role === 'PROJECT_LEAD') {
    const institutionId =
      typeof req.query.institutionId === 'string' ? req.query.institutionId.trim() : '';
    if (!institutionId) {
      res.status(400).json({ error: 'institutionId is required' });
      return null;
    }
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { id: true },
    });
    if (!institution) {
      res.status(404).json({ error: 'Institution not found' });
      return null;
    }
    return { institutionId, role: 'PROJECT_LEAD' };
  }
  res.status(403).json({ error: 'Forbidden' });
  return null;
}

/** List rubric versions for consensus: project leads or institution-bound College leads. */
function requireConsensusRubricVersionsAccess(req: Request, res: Response): SessionUser | null {
  const sessionUser = parseSessionUser(req);
  if (!sessionUser) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  if (sessionUser.role === 'PROJECT_LEAD') {
    return sessionUser;
  }
  if (sessionUser.role === 'LOCAL_LEADER' && sessionUser.institutionId) {
    return sessionUser;
  }
  res.status(403).json({ error: 'Forbidden' });
  return null;
}

type ConsensusEntryInput = {
  scaleVersionId: string;
  score: number;
  justification: string;
};

type PathwayContext = {
  pathwayId: string;
  pathwayName: string;
  isGeneralPathway: boolean;
};

type ConsensusContext = PathwayContext & {
  rubricVersionId: string;
  consensusStatus: 'DRAFT' | 'SUBMITTED' | null;
  hasSubmittedConsensus: boolean;
};

type ConsensusContextGroup = PathwayContext & {
  contexts: ConsensusContext[];
};

type PathwayWhereFilter = { pathwayId?: { in: string[] } };

const PLAIN_CALENDAR_DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Builds bounds for `Response.submittedAt` (absolute DB instants).
 * - Plain `YYYY-MM-DD` only: start / end of that **GMT** calendar day (legacy; API tests, bookmarks).
 * - Any other string (e.g. ISO 8601 from the app): parsed as a single instant (`Date`); use for
 *   client-sent local calendar bounds encoded as UTC ISO.
 */
function buildSubmittedAtFilter(
  submittedFrom?: string | null,
  submittedTo?: string | null
): { gte: Date; lte?: Date } | { gte?: Date; lte: Date } | undefined {
  const normalize = (value?: string | null) => value?.trim() || undefined;
  const fromRaw = normalize(submittedFrom);
  const toRaw = normalize(submittedTo);

  const parseBound = (raw: string, endOfDay: boolean): Date | null => {
    if (PLAIN_CALENDAR_DAY_PATTERN.test(raw)) {
      const parts = raw.split('-').map(Number);
      if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
      const [year, month, day] = parts as [number, number, number];
      if (endOfDay) {
        return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      }
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    }
    const instant = new Date(raw);
    return Number.isNaN(instant.getTime()) ? null : instant;
  };

  const gte = fromRaw ? parseBound(fromRaw, false) : null;
  const lte = toRaw ? parseBound(toRaw, true) : null;
  if (!gte && !lte) return undefined;
  if (gte && lte) return { gte, lte };
  if (gte) return { gte };
  if (lte) return { lte };
  return undefined;
}

function parseConsensusEntries(raw: unknown): ConsensusEntryInput[] {
  if (!Array.isArray(raw)) {
    throw new Error('entries must be an array');
  }
  return raw.map((row, index) => {
    if (!row || typeof row !== 'object') {
      throw new Error(`Invalid entry at index ${index}`);
    }
    const entry = row as Record<string, unknown>;
    if (typeof entry.scaleVersionId !== 'string') {
      throw new Error(`Missing scaleVersionId at index ${index}`);
    }
    if (typeof entry.score !== 'number') {
      throw new Error(`Missing score at index ${index}`);
    }
    if (typeof entry.justification !== 'string') {
      throw new Error(`Missing justification at index ${index}`);
    }
    return {
      scaleVersionId: entry.scaleVersionId,
      score: entry.score,
      justification: entry.justification,
    };
  });
}

// ---------------------------------------------------------------------------
// Pathway filters
// ---------------------------------------------------------------------------

function parseCommaSeparatedIds(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) return [];
  return [
    ...new Set(
      raw
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];
}

/**
 * Optional pathway filter: `pathwayIds` (comma-separated) takes precedence over `pathwayId`.
 * Blank values and the legacy general key resolve to the General pathway.
 * Returns undefined when no pathway filter was requested.
 */
function parsePathwayIdsFromQuery(req: Request): string[] | undefined {
  const rawPathwayIds = req.query.pathwayIds;
  if (typeof rawPathwayIds === 'string' && rawPathwayIds.trim()) {
    const pathwayIds = parseCommaSeparatedIds(rawPathwayIds).map((id) => resolvePathwayId(id));
    return [...new Set(pathwayIds)];
  }
  if (typeof req.query.pathwayId === 'string') {
    return [resolvePathwayId(req.query.pathwayId)];
  }
  return undefined;
}

function buildPathwayWhereFilter(req: Request): PathwayWhereFilter {
  const pathwayIds = parsePathwayIdsFromQuery(req);
  if (!pathwayIds) {
    return {};
  }
  return { pathwayId: { in: pathwayIds.filter((pathwayId) => isPathwayId(pathwayId)) } };
}

/** Pathway for write/read-one endpoints: always set, General by default. Null when unknown. */
function parseRequiredPathwayId(value: unknown): string | null {
  const pathwayId = resolvePathwayId(value);
  return isPathwayId(pathwayId) ? pathwayId : null;
}

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

function compareContextsByPathway(left: PathwayContext, right: PathwayContext): number {
  if (left.isGeneralPathway && !right.isGeneralPathway) return -1;
  if (!left.isGeneralPathway && right.isGeneralPathway) return 1;
  return left.pathwayName.localeCompare(right.pathwayName, undefined, { sensitivity: 'base' });
}

async function buildConsensusContexts(args: {
  institutionId: string;
  rubricVersionId: string;
  consensusUserId?: string;
}): Promise<ConsensusContext[]> {
  const assignmentRows = await prisma.userRubricAssignment.findMany({
    where: {
      rubricVersionId: args.rubricVersionId,
      user: { institutionId: args.institutionId },
    },
    select: {
      pathwayId: true,
      pathway: { select: { name: true } },
    },
  });

  const submittedRows = await prisma.consensusResponse.findMany({
    where: {
      institutionId: args.institutionId,
      rubricVersionId: args.rubricVersionId,
      status: 'SUBMITTED',
    },
    select: { pathwayId: true },
  });

  const currentUserRows = args.consensusUserId
    ? await prisma.consensusResponse.findMany({
        where: {
          userId: args.consensusUserId,
          institutionId: args.institutionId,
          rubricVersionId: args.rubricVersionId,
        },
        select: { pathwayId: true, status: true },
      })
    : [];

  const hasSubmittedByPathwayId = new Set(submittedRows.map((row) => row.pathwayId));
  const statusByPathwayId = new Map(currentUserRows.map((row) => [row.pathwayId, row.status]));
  const contextByPathwayId = new Map<string, ConsensusContext>();

  for (const assignmentRow of assignmentRows) {
    const { pathwayId } = assignmentRow;
    if (contextByPathwayId.has(pathwayId)) {
      continue;
    }
    contextByPathwayId.set(pathwayId, {
      rubricVersionId: args.rubricVersionId,
      pathwayId,
      pathwayName: assignmentRow.pathway.name,
      isGeneralPathway: isGeneralPathwayId(pathwayId),
      consensusStatus: statusByPathwayId.get(pathwayId) ?? null,
      hasSubmittedConsensus: hasSubmittedByPathwayId.has(pathwayId),
    });
  }

  return [...contextByPathwayId.values()].sort(compareContextsByPathway);
}

function buildConsensusContextGroups(contexts: ConsensusContext[]): ConsensusContextGroup[] {
  const groupByPathwayId = new Map<string, ConsensusContextGroup>();

  for (const context of contexts) {
    const existingGroup = groupByPathwayId.get(context.pathwayId);
    if (existingGroup) {
      existingGroup.contexts.push(context);
      continue;
    }
    groupByPathwayId.set(context.pathwayId, {
      pathwayId: context.pathwayId,
      pathwayName: context.pathwayName,
      isGeneralPathway: context.isGeneralPathway,
      contexts: [context],
    });
  }

  return [...groupByPathwayId.values()].sort(compareContextsByPathway);
}

/** GET rubric IDs in this institution that have at least one submitted consensus (any version). */
router.get('/completion-by-rubric', async (req: Request, res: Response) => {
  try {
    const scope = await resolveConsensusDataScope(req, res);
    if (!scope) return;

    const rows = await prisma.consensusResponse.findMany({
      where: {
        institutionId: scope.institutionId,
        status: 'SUBMITTED',
        ...buildPathwayWhereFilter(req),
      },
      select: {
        pathwayId: true,
        rubricVersion: { select: { rubricId: true } },
      },
    });

    const rubricIds = [...new Set(rows.map((row) => row.rubricVersion.rubricId))];
    return res.json({
      rubricIdsWithSubmittedConsensus: rubricIds,
      submittedContexts: rows.map((row) => ({
        rubricId: row.rubricVersion.rubricId,
        pathwayId: row.pathwayId,
        isGeneralPathway: isGeneralPathwayId(row.pathwayId),
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load consensus completion' });
  }
});

router.get('/contexts', async (req: Request, res: Response) => {
  try {
    const scope = await resolveConsensusDataScope(req, res);
    if (!scope) return;

    const sessionUser = parseSessionUser(req);
    const rubricId = typeof req.query.rubricId === 'string' ? req.query.rubricId.trim() : '';
    if (!rubricId) {
      return res.status(400).json({ error: 'rubricId is required' });
    }

    const rubricVersionId = await findLatestRubricVersionId(rubricId);
    if (!rubricVersionId) {
      return res.status(404).json({ error: 'No rubric version found' });
    }

    const contexts = await buildConsensusContexts({
      institutionId: scope.institutionId,
      rubricVersionId,
      ...(scope.role === 'LOCAL_LEADER' && sessionUser ? { consensusUserId: sessionUser.id } : {}),
    });

    return res.json({
      rubricVersionId,
      contexts,
      groups: buildConsensusContextGroups(contexts),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load consensus contexts' });
  }
});

/**
 * All rubrics that have at least one consensus context for the scoped institution (latest published
 * version per rubric). Omits rubrics with no version or no assignments-derived contexts.
 */
router.get('/contexts-grouped', async (req: Request, res: Response) => {
  try {
    const scope = await resolveConsensusDataScope(req, res);
    if (!scope) return;

    const sessionUser = parseSessionUser(req);

    const rubrics = await prisma.rubric.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });

    const groups: Array<{
      rubricId: string;
      rubricTitle: string;
      rubricVersionId: string;
      contexts: ConsensusContext[];
    }> = [];

    for (const rubric of rubrics) {
      const rubricVersionId = await findLatestRubricVersionId(rubric.id);
      if (!rubricVersionId) {
        continue;
      }

      const contexts = await buildConsensusContexts({
        institutionId: scope.institutionId,
        rubricVersionId,
        ...(scope.role === 'LOCAL_LEADER' && sessionUser
          ? { consensusUserId: sessionUser.id }
          : {}),
      });

      if (contexts.length === 0) {
        continue;
      }

      groups.push({
        rubricId: rubric.id,
        rubricTitle: rubric.title,
        rubricVersionId,
        contexts,
      });
    }

    return res.json({ groups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load grouped consensus contexts' });
  }
});

/** Assignment status counts for the latest rubric version of a rubric, scoped to institution members. */
router.get('/assignment-summary', async (req: Request, res: Response) => {
  try {
    const scope = await resolveConsensusDataScope(req, res);
    if (!scope) return;

    const rubricId = req.query.rubricId as string | undefined;
    if (!rubricId) {
      return res.status(400).json({ error: 'rubricId is required' });
    }

    const rubricVersionId = await findLatestRubricVersionId(rubricId);
    if (!rubricVersionId) {
      return res.status(404).json({ error: 'No rubric version found' });
    }

    const totalInstitutionUsers = await prisma.user.count({
      where: { institutionId: scope.institutionId },
    });

    const assignmentGroups = await prisma.userRubricAssignment.groupBy({
      by: ['status'],
      where: {
        rubricVersionId,
        user: { institutionId: scope.institutionId },
        ...buildPathwayWhereFilter(req),
      },
      _count: { _all: true },
    });

    let assigned = 0;
    let inProgress = 0;
    let completed = 0;
    for (const g of assignmentGroups) {
      if (g.status === 'ASSIGNED') assigned = g._count._all;
      if (g.status === 'IN_PROGRESS') inProgress = g._count._all;
      if (g.status === 'COMPLETED') completed = g._count._all;
    }

    return res.json({
      rubricVersionId,
      totalInstitutionUsers,
      assigned,
      inProgress,
      completed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load assignment summary' });
  }
});

/** All published rubric versions for the rubric (newest first). */
router.get('/rubric-versions', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireConsensusRubricVersionsAccess(req, res);
    if (!sessionUser) return;

    const rubricId = req.query.rubricId as string | undefined;
    if (!rubricId) {
      return res.status(400).json({ error: 'rubricId is required' });
    }

    const rubric = await prisma.rubric.findUnique({
      where: { id: rubricId },
      select: { id: true },
    });
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric not found' });
    }

    const versions = await prisma.rubricVersion.findMany({
      where: { rubricId },
      select: { id: true, versionNum: true, publishedAt: true },
      orderBy: { versionNum: 'desc' },
    });

    return res.json({ versions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load rubric versions' });
  }
});

type ConsensusRatingCounts = { 0: number; 1: number; 2: number; 3: number; 4: number };

function createEmptyConsensusRatingCounts(): ConsensusRatingCounts {
  return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
}

type ScaleDistributionBucket = {
  scoreCounts: ConsensusRatingCounts;
  average: number | null;
};

function getOrCreateScaleDistributionBucket(
  byScale: Record<string, ScaleDistributionBucket>,
  scaleVersionId: string
): ScaleDistributionBucket {
  const existingBucket = byScale[scaleVersionId];
  if (existingBucket) return existingBucket;
  const bucket: ScaleDistributionBucket = {
    scoreCounts: createEmptyConsensusRatingCounts(),
    average: null,
  };
  byScale[scaleVersionId] = bucket;
  return bucket;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * AVERAGE_DECIMAL_FACTOR) / AVERAGE_DECIMAL_FACTOR;
}

/** Histogram + average of submitted self-assessment responses by institution raters. */
router.get('/scale-distributions', async (req: Request, res: Response) => {
  try {
    const scope = await resolveConsensusDataScope(req, res);
    if (!scope) return;

    const rubricVersionId = req.query.rubricVersionId as string | undefined;
    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const submittedFrom = req.query.submittedFrom as string | undefined;
    const submittedTo = req.query.submittedTo as string | undefined;
    const submittedAtFilter = buildSubmittedAtFilter(submittedFrom, submittedTo);

    const rubricVersion = await prisma.rubricVersion.findUnique({
      where: { id: rubricVersionId },
      select: { id: true },
    });
    if (!rubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const responseWhere = {
      rubricVersionId,
      status: 'SUBMITTED' as const,
      user: { institutionId: scope.institutionId },
      ...buildPathwayWhereFilter(req),
      ...(submittedAtFilter ? { submittedAt: submittedAtFilter } : {}),
    };

    const countRows = await prisma.response.groupBy({
      by: ['scaleVersionId', 'score'],
      where: responseWhere,
      _count: { _all: true },
    });

    const averages = await prisma.response.groupBy({
      by: ['scaleVersionId'],
      where: responseWhere,
      _avg: { score: true },
    });

    const byScale: Record<string, ScaleDistributionBucket> = {};

    for (const row of countRows) {
      const bucket = getOrCreateScaleDistributionBucket(byScale, row.scaleVersionId);
      if (row.score >= SCORE_MIN && row.score <= SCORE_MAX) {
        bucket.scoreCounts[row.score as keyof ConsensusRatingCounts] = row._count._all;
      }
    }

    for (const row of averages) {
      const bucket = getOrCreateScaleDistributionBucket(byScale, row.scaleVersionId);
      bucket.average = row._avg.score === null ? null : roundToTwoDecimals(row._avg.score);
    }

    const noteRows = await prisma.response.findMany({
      where: {
        ...responseWhere,
        justification: { not: null },
      },
      select: {
        scaleVersionId: true,
        justification: true,
        submittedAt: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    const submissionNotesByScaleVersionId: Record<string, string[]> = {};
    for (const row of noteRows) {
      const text = (row.justification ?? '').trim();
      if (!text) continue;
      const list = submissionNotesByScaleVersionId[row.scaleVersionId];
      if (list) {
        list.push(text);
      } else {
        submissionNotesByScaleVersionId[row.scaleVersionId] = [text];
      }
    }

    return res.json({ byScaleVersionId: byScale, submissionNotesByScaleVersionId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load distributions' });
  }
});

function parseBooleanQueryFlag(rawValue: unknown): boolean {
  if (typeof rawValue !== 'string') return false;
  const normalizedValue = rawValue.trim().toLowerCase();
  return normalizedValue === 'true' || normalizedValue === '1';
}

function formatInstitutionAggregateLabel(institution: {
  name: string;
  academicSchoolYear: string;
}): string {
  return `${institution.name} (${institution.academicSchoolYear})`;
}

type ConsensusAggregateRow = { entries: unknown; institutionId?: string };

function aggregateConsensusEntriesFromRows(
  rows: ConsensusAggregateRow[],
  institutionLabelById?: Map<string, string>
): {
  byScaleVersionId: Record<string, ConsensusRatingCounts>;
  consensusSubmissionCount: number;
  institutionNamesByScaleAndRating?: Record<string, Record<string, string[]>>;
} {
  const byScaleVersionId: Record<string, ConsensusRatingCounts> = {};
  const institutionIdSetsByScaleAndScore = new Map<string, Map<number, Set<string>>>();

  const trackInstitutionForScore = (
    scaleId: string,
    score: number,
    institutionId: string | undefined
  ) => {
    if (!institutionLabelById || !institutionId) return;
    if (score < RATING_TOOLTIP_MIN || score > RATING_TOOLTIP_MAX) return;
    let byScore = institutionIdSetsByScaleAndScore.get(scaleId);
    if (!byScore) {
      byScore = new Map();
      institutionIdSetsByScaleAndScore.set(scaleId, byScore);
    }
    let idSet = byScore.get(score);
    if (!idSet) {
      idSet = new Set();
      byScore.set(score, idSet);
    }
    idSet.add(institutionId);
  };

  for (const row of rows) {
    const entries = row.entries;
    if (!Array.isArray(entries)) continue;
    for (const item of entries) {
      if (!item || typeof item !== 'object') continue;
      const entry = item as Record<string, unknown>;
      if (typeof entry.scaleVersionId !== 'string') continue;
      if (typeof entry.score !== 'number') continue;
      const scaleId = entry.scaleVersionId;
      const score = entry.score;
      if (!byScaleVersionId[scaleId]) {
        byScaleVersionId[scaleId] = createEmptyConsensusRatingCounts();
      }
      if (score >= SCORE_MIN && score <= SCORE_MAX) {
        byScaleVersionId[scaleId][score as keyof ConsensusRatingCounts] += 1;
        trackInstitutionForScore(scaleId, score, row.institutionId);
      }
    }
  }

  if (!institutionLabelById) {
    return { byScaleVersionId, consensusSubmissionCount: rows.length };
  }

  const institutionNamesByScaleAndRating: Record<string, Record<string, string[]>> = {};
  for (const [scaleId, byScore] of institutionIdSetsByScaleAndScore) {
    const ratingToNames: Record<string, string[]> = {};
    for (const [score, idSet] of byScore) {
      const labels = [...idSet]
        .map((id) => institutionLabelById.get(id) ?? 'Unknown institution')
        .sort((a, b) => a.localeCompare(b));
      ratingToNames[String(score)] = labels;
    }
    institutionNamesByScaleAndRating[scaleId] = ratingToNames;
  }

  return {
    byScaleVersionId,
    consensusSubmissionCount: rows.length,
    institutionNamesByScaleAndRating,
  };
}

/** Ratings 0–4 chosen in submitted consensus entries (per scale) for outline highlights. */
function buildConsensusHighlightRatingsFromRows(
  rows: ConsensusAggregateRow[]
): Record<string, number[]> {
  const ratingSetsByScaleId = new Map<string, Set<number>>();
  for (const row of rows) {
    const entries = row.entries;
    if (!Array.isArray(entries)) continue;
    for (const item of entries) {
      if (!item || typeof item !== 'object') continue;
      const entry = item as Record<string, unknown>;
      if (typeof entry.scaleVersionId !== 'string') continue;
      if (typeof entry.score !== 'number') continue;
      const score = entry.score;
      if (score < RATING_TOOLTIP_MIN || score > RATING_TOOLTIP_MAX) continue;
      let ratings = ratingSetsByScaleId.get(entry.scaleVersionId);
      if (!ratings) {
        ratings = new Set();
        ratingSetsByScaleId.set(entry.scaleVersionId, ratings);
      }
      ratings.add(score);
    }
  }
  const result: Record<string, number[]> = {};
  for (const [scaleVersionId, ratings] of ratingSetsByScaleId) {
    result[scaleVersionId] = [...ratings].sort((a, b) => a - b);
  }
  return result;
}

/**
 * Aggregate submitted consensus rating counts across one or many institutions (project lead only).
 * Used for cross-institution tabular consensus review.
 */
router.get('/consensus-rating-aggregate', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireProjectLead(req, res);
    if (!sessionUser) return;

    const rubricVersionId =
      typeof req.query.rubricVersionId === 'string' ? req.query.rubricVersionId.trim() : '';
    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const rubricVersion = await prisma.rubricVersion.findUnique({
      where: { id: rubricVersionId },
      select: { id: true },
    });
    if (!rubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const useAllWithConsensus = parseBooleanQueryFlag(req.query.allInstitutionsWithConsensus);
    const shouldCompareAgainstOtherInstitutions = parseBooleanQueryFlag(
      req.query.compareAgainstOtherInstitutions
    );
    const includePerScoreInstitutions = parseBooleanQueryFlag(
      req.query.includePerScoreInstitutions
    );
    const pathwayWhereFilter = buildPathwayWhereFilter(req);

    let institutionIds: string[] = [];

    if (shouldCompareAgainstOtherInstitutions) {
      if (useAllWithConsensus) {
        return res.status(400).json({
          error:
            'compareAgainstOtherInstitutions cannot be used with allInstitutionsWithConsensus=true',
        });
      }
      const excludedInstitutionIds = parseCommaSeparatedIds(
        req.query.institutionIds as string | undefined
      );
      if (excludedInstitutionIds.length === 0) {
        return res.status(400).json({
          error: 'institutionIds is required when compareAgainstOtherInstitutions=true',
        });
      }
      const foundExcluded = await prisma.institution.findMany({
        where: { id: { in: excludedInstitutionIds } },
        select: { id: true },
      });
      if (foundExcluded.length !== excludedInstitutionIds.length) {
        return res.status(400).json({ error: 'One or more institution IDs are invalid' });
      }
      const grouped = await prisma.consensusResponse.groupBy({
        by: ['institutionId'],
        where: {
          rubricVersionId,
          status: 'SUBMITTED',
          institutionId: { notIn: excludedInstitutionIds },
          ...pathwayWhereFilter,
        },
      });
      institutionIds = grouped.map((row) => row.institutionId);
    } else if (useAllWithConsensus) {
      const grouped = await prisma.consensusResponse.groupBy({
        by: ['institutionId'],
        where: {
          rubricVersionId,
          status: 'SUBMITTED',
          ...pathwayWhereFilter,
        },
      });
      institutionIds = grouped.map((row) => row.institutionId);
    } else {
      institutionIds = parseCommaSeparatedIds(req.query.institutionIds as string | undefined);
      if (institutionIds.length === 0) {
        return res.status(400).json({
          error: 'institutionIds or allInstitutionsWithConsensus=true is required',
        });
      }
      const found = await prisma.institution.findMany({
        where: { id: { in: institutionIds } },
        select: { id: true },
      });
      if (found.length !== institutionIds.length) {
        return res.status(400).json({ error: 'One or more institution IDs are invalid' });
      }
    }

    if (institutionIds.length === 0) {
      return res.json({
        byScaleVersionId: {} as Record<string, ConsensusRatingCounts>,
        consensusSubmissionCount: 0,
        ...(includePerScoreInstitutions
          ? { institutionNamesByScaleAndRating: {} as Record<string, Record<string, string[]>> }
          : {}),
      });
    }

    const consensusRows = await prisma.consensusResponse.findMany({
      where: {
        rubricVersionId,
        status: 'SUBMITTED',
        institutionId: { in: institutionIds },
        ...pathwayWhereFilter,
      },
      select: {
        entries: true,
        ...(includePerScoreInstitutions ? { institutionId: true } : {}),
      },
    });

    let institutionLabelById: Map<string, string> | undefined;
    if (includePerScoreInstitutions) {
      const institutions = await prisma.institution.findMany({
        where: { id: { in: institutionIds } },
        select: { id: true, name: true, academicSchoolYear: true },
      });
      institutionLabelById = new Map(
        institutions.map((institution) => [
          institution.id,
          formatInstitutionAggregateLabel(institution),
        ])
      );
    }

    const aggregated = aggregateConsensusEntriesFromRows(consensusRows, institutionLabelById);
    return res.json(aggregated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to aggregate consensus ratings' });
  }
});

/**
 * Aggregate submitted consensus rating counts for College leads.
 * - Default scope: current College lead institution only.
 * - Optional compare scope: all institutions with consensus, excluding College lead institution.
 */
router.get('/local-leader-consensus-rating-aggregate', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireLocalLeaderWithInstitution(req, res);
    if (!sessionUser) return;

    const rubricVersionId =
      typeof req.query.rubricVersionId === 'string' ? req.query.rubricVersionId.trim() : '';
    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const rubricVersion = await prisma.rubricVersion.findUnique({
      where: { id: rubricVersionId },
      select: { id: true },
    });
    if (!rubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const shouldCompareAgainstOtherInstitutions = parseBooleanQueryFlag(
      req.query.compareAgainstOtherInstitutions
    );

    const consensusRows = await prisma.consensusResponse.findMany({
      where: {
        rubricVersionId,
        status: 'SUBMITTED',
        ...buildPathwayWhereFilter(req),
        institutionId: shouldCompareAgainstOtherInstitutions
          ? { not: sessionUser.institutionId }
          : sessionUser.institutionId,
      },
      select: { entries: true },
    });

    const aggregated = aggregateConsensusEntriesFromRows(consensusRows);
    return res.json({
      ...aggregated,
      institutionConsensusRatingsByScaleVersionId:
        buildConsensusHighlightRatingsFromRows(consensusRows),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to aggregate consensus ratings' });
  }
});

/** Submitted consensus rows for an institution (project lead review only). */
router.get('/by-institution', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireProjectLead(req, res);
    if (!sessionUser) return;

    const rubricVersionId = req.query.rubricVersionId as string | undefined;
    const institutionId =
      typeof req.query.institutionId === 'string' ? req.query.institutionId.trim() : '';
    if (!rubricVersionId || !institutionId) {
      return res.status(400).json({ error: 'rubricVersionId and institutionId are required' });
    }

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { id: true },
    });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const rows = await prisma.consensusResponse.findMany({
      where: {
        institutionId,
        rubricVersionId,
        status: 'SUBMITTED',
        ...buildPathwayWhereFilter(req),
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        pathway: { select: { name: true } },
      },
    });

    return res.json({
      consensuses: rows.map((row) => ({
        userId: row.userId,
        userName: row.user?.name ?? '',
        userEmail: row.user?.email ?? '',
        pathwayId: row.pathwayId,
        pathwayName: row.pathway.name,
        isGeneralPathway: isGeneralPathwayId(row.pathwayId),
        submittedAt: row.submittedAt,
        entries: row.entries,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load institution consensus' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireLocalLeaderWithInstitution(req, res);
    if (!sessionUser) return;

    const rubricVersionId = req.query.rubricVersionId as string | undefined;
    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }
    const pathwayId = parseRequiredPathwayId(req.query.pathwayId);
    if (!pathwayId) {
      return res.status(400).json({ error: 'Invalid pathwayId' });
    }

    const record = await prisma.consensusResponse.findFirst({
      where: {
        userId: sessionUser.id,
        rubricVersionId,
        pathwayId,
      },
    });

    if (!record) {
      return res.json({ consensus: null });
    }

    return res.json({
      consensus: {
        pathwayId: record.pathwayId,
        isGeneralPathway: isGeneralPathwayId(record.pathwayId),
        status: record.status,
        submittedAt: record.submittedAt,
        entries: record.entries,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load consensus response' });
  }
});

type ConsensusScaleVersion = {
  id: string;
  rubricVersionId: string;
  prompt: string;
};

function normalizeOneEntry(
  entry: ConsensusEntryInput,
  scale: ConsensusScaleVersion,
  requireNonEmptyJustification: boolean
): ConsensusEntryInput {
  if (entry.score < SCORE_MIN || entry.score > SCORE_MAX) {
    throw new Error('Score must be between 0 and 4');
  }

  if (requireNonEmptyJustification && !entry.justification.trim()) {
    throw new Error('Justification is required for each scale');
  }

  return {
    scaleVersionId: scale.id,
    score: entry.score,
    justification: requireNonEmptyJustification ? entry.justification.trim() : entry.justification,
  };
}

async function loadConsensusRubricScaleContext(rubricVersionId: string) {
  const rubricVersion = await prisma.rubricVersion.findUnique({
    where: { id: rubricVersionId },
    include: {
      scaleVersions: {
        orderBy: { orderIndex: 'asc' },
        select: { id: true, rubricVersionId: true, prompt: true },
      },
    },
  });
  if (!rubricVersion) {
    throw new Error('Rubric version not found');
  }

  const allScales: ConsensusScaleVersion[] = rubricVersion.scaleVersions;
  const scaleById = new Map(allScales.map((scale) => [scale.id, scale]));

  return { scaleById, allScales };
}

function assertEntryScaleBelongsToRubric(
  scale: ConsensusScaleVersion | undefined,
  rubricVersionId: string
): ConsensusScaleVersion {
  if (!scale || scale.rubricVersionId !== rubricVersionId) {
    throw new Error('Invalid scale version id in entries');
  }
  return scale;
}

async function normalizeDraftEntries(
  rubricVersionId: string,
  entries: ConsensusEntryInput[]
): Promise<ConsensusEntryInput[]> {
  const { scaleById } = await loadConsensusRubricScaleContext(rubricVersionId);

  return entries.map((entry) => {
    const scale = assertEntryScaleBelongsToRubric(
      scaleById.get(entry.scaleVersionId),
      rubricVersionId
    );
    return normalizeOneEntry(entry, scale, false);
  });
}

async function normalizeSubmitEntries(
  rubricVersionId: string,
  entries: ConsensusEntryInput[]
): Promise<ConsensusEntryInput[]> {
  const { scaleById, allScales } = await loadConsensusRubricScaleContext(rubricVersionId);

  for (const entry of entries) {
    assertEntryScaleBelongsToRubric(scaleById.get(entry.scaleVersionId), rubricVersionId);
  }

  const entryByScaleId = new Map(entries.map((entry) => [entry.scaleVersionId, entry]));

  return allScales.map((scale) => {
    const entry = entryByScaleId.get(scale.id);
    if (!entry) {
      throw new Error(`Missing consensus entry for: ${scale.prompt.slice(0, JUSTIFICATION_PREVIEW_LENGTH)}`);
    }
    return normalizeOneEntry(entry, scale, true);
  });
}

async function hasConsensusAssignmentContext(args: {
  institutionId: string;
  rubricVersionId: string;
  pathwayId: string;
}): Promise<boolean> {
  const assignmentCount = await prisma.userRubricAssignment.count({
    where: {
      rubricVersionId: args.rubricVersionId,
      pathwayId: args.pathwayId,
      user: {
        institutionId: args.institutionId,
      },
    },
  });

  return assignmentCount > 0;
}

type ConsensusWriteBody = {
  rubricVersionId?: string;
  entries?: unknown;
  pathwayId?: unknown;
};

async function saveConsensusResponse(args: {
  userId: string;
  institutionId: string;
  rubricVersionId: string;
  pathwayId: string;
  status: 'DRAFT' | 'SUBMITTED';
  entries: ConsensusEntryInput[];
  existingId?: string;
}): Promise<void> {
  const data = {
    status: args.status,
    entries: args.entries as object[],
    submittedAt: args.status === 'SUBMITTED' ? new Date() : null,
  };

  if (args.existingId) {
    await prisma.consensusResponse.update({ where: { id: args.existingId }, data });
    return;
  }

  await prisma.consensusResponse.create({
    data: {
      ...data,
      userId: args.userId,
      institutionId: args.institutionId,
      rubricVersionId: args.rubricVersionId,
      pathwayId: args.pathwayId,
    },
  });
}

router.post('/save-draft', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireLocalLeaderWithInstitution(req, res);
    if (!sessionUser) return;

    const { rubricVersionId, entries: rawEntries, pathwayId: rawPathwayId } =
      req.body as ConsensusWriteBody;

    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const pathwayId = parseRequiredPathwayId(rawPathwayId);
    if (!pathwayId) {
      return res.status(400).json({ error: 'Invalid pathwayId' });
    }

    const hasAssignments = await hasConsensusAssignmentContext({
      institutionId: sessionUser.institutionId,
      rubricVersionId,
      pathwayId,
    });
    if (!hasAssignments) {
      return res.status(400).json({
        error:
          'Cannot create a consensus response for a context with no rubric assignments in this institution',
      });
    }

    const existing = await prisma.consensusResponse.findFirst({
      where: {
        userId: sessionUser.id,
        rubricVersionId,
        pathwayId,
      },
    });
    if (existing?.status === 'SUBMITTED') {
      return res.status(400).json({ error: 'Submitted consensus cannot be edited' });
    }

    const entriesInput = rawEntries === undefined ? [] : parseConsensusEntries(rawEntries);
    const entries =
      entriesInput.length === 0 ? [] : await normalizeDraftEntries(rubricVersionId, entriesInput);

    await saveConsensusResponse({
      userId: sessionUser.id,
      institutionId: sessionUser.institutionId,
      rubricVersionId,
      pathwayId,
      status: 'DRAFT',
      entries,
      ...(existing ? { existingId: existing.id } : {}),
    });

    return res.json({ message: 'Consensus draft saved' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save draft';
    console.error(error);
    return res.status(400).json({ error: message });
  }
});

router.post('/submit', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireLocalLeaderWithInstitution(req, res);
    if (!sessionUser) return;

    const { rubricVersionId, entries: rawEntries, pathwayId: rawPathwayId } =
      req.body as ConsensusWriteBody;

    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const pathwayId = parseRequiredPathwayId(rawPathwayId);
    if (!pathwayId) {
      return res.status(400).json({ error: 'Invalid pathwayId' });
    }

    const hasAssignments = await hasConsensusAssignmentContext({
      institutionId: sessionUser.institutionId,
      rubricVersionId,
      pathwayId,
    });
    if (!hasAssignments) {
      return res.status(400).json({
        error:
          'Cannot submit a consensus response for a context with no rubric assignments in this institution',
      });
    }

    const existing = await prisma.consensusResponse.findFirst({
      where: {
        userId: sessionUser.id,
        rubricVersionId,
        pathwayId,
      },
    });
    if (existing?.status === 'SUBMITTED') {
      return res.status(400).json({ error: 'Consensus already submitted' });
    }

    const entriesInput = parseConsensusEntries(rawEntries ?? []);
    const entries = await normalizeSubmitEntries(rubricVersionId, entriesInput);

    await saveConsensusResponse({
      userId: sessionUser.id,
      institutionId: sessionUser.institutionId,
      rubricVersionId,
      pathwayId,
      status: 'SUBMITTED',
      entries,
      ...(existing ? { existingId: existing.id } : {}),
    });

    return res.json({ message: 'Consensus submitted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit';
    console.error(error);
    const status = message.includes('Missing') || message.includes('required') ? 400 : 500;
    return res.status(status).json({ error: message });
  }
});

export default router;
