import { findLatestRubricVersionId } from '@lib/rubricVersion';
import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

const SCORE_MIN = 0;
const SCORE_MAX = 4;

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
    res.status(400).json({ error: 'Local leader has no institution' });
    return null;
  }
  return { ...sessionUser, institutionId: sessionUser.institutionId };
}

/** Institution used for histograms and assignment counts: session for local leaders, query for project leads. */
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
      res.status(400).json({ error: 'Local leader has no institution' });
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

/** List rubric versions for consensus: project leads or institution-bound local leaders. */
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
  predefinedBinId?: string | null;
  score: number;
  justification: string;
};

function normalizePredefinedBinId(predefinedBinId?: string | null): string | null {
  if (!predefinedBinId) return null;
  return predefinedBinId;
}

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
      predefinedBinId:
        entry.predefinedBinId === undefined || entry.predefinedBinId === null
          ? null
          : String(entry.predefinedBinId),
      score: entry.score,
      justification: entry.justification,
    };
  });
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
      },
      select: {
        rubricVersion: { select: { rubricId: true } },
      },
    });

    const rubricIds = [...new Set(rows.map((row) => row.rubricVersion.rubricId))];
    return res.json({ rubricIdsWithSubmittedConsensus: rubricIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load consensus completion' });
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

    const byScale: Record<string, { scoreCounts: Record<number, number>; average: number | null }> =
      {};

    for (const row of countRows) {
      let bucket = byScale[row.scaleVersionId];
      if (!bucket) {
        bucket = {
          scoreCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
          average: null,
        };
        byScale[row.scaleVersionId] = bucket;
      }
      if (row.score >= SCORE_MIN && row.score <= SCORE_MAX) {
        bucket.scoreCounts[row.score] = row._count._all;
      }
    }

    for (const row of averages) {
      let bucket = byScale[row.scaleVersionId];
      if (!bucket) {
        bucket = {
          scoreCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
          average: null,
        };
        byScale[row.scaleVersionId] = bucket;
      }
      bucket.average = row._avg.score === null ? null : Math.round(row._avg.score * 100) / 100;
    }

    return res.json({ byScaleVersionId: byScale });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load distributions' });
  }
});

type ConsensusRatingCounts = { 0: number; 1: number; 2: number; 3: number; 4: number };

function createEmptyConsensusRatingCounts(): ConsensusRatingCounts {
  return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
}

function parseInstitutionIdsParam(raw: string | undefined): string[] {
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

function aggregateConsensusEntriesFromRows(rows: { entries: unknown }[]): {
  byScaleVersionId: Record<string, ConsensusRatingCounts>;
  consensusSubmissionCount: number;
} {
  const byScaleVersionId: Record<string, ConsensusRatingCounts> = {};
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
      }
    }
  }
  return { byScaleVersionId, consensusSubmissionCount: rows.length };
}

/**
 * Aggregate submitted consensus rating counts across one or many institutions (project lead only).
 * Used for cross-institution tabular consensus review.
 */
router.get('/consensus-rating-aggregate', async (req: Request, res: Response) => {
  try {
    const sessionUser = parseSessionUser(req);
    if (!sessionUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (sessionUser.role !== 'PROJECT_LEAD') {
      return res.status(403).json({ error: 'Forbidden' });
    }

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

    const useAllWithConsensus =
      req.query.allInstitutionsWithConsensus === 'true' ||
      req.query.allInstitutionsWithConsensus === '1';

    let institutionIds: string[] = [];

    if (useAllWithConsensus) {
      const grouped = await prisma.consensusResponse.groupBy({
        by: ['institutionId'],
        where: { rubricVersionId, status: 'SUBMITTED' },
      });
      institutionIds = grouped.map((row) => row.institutionId);
    } else {
      institutionIds = parseInstitutionIdsParam(req.query.institutionIds as string | undefined);
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
      });
    }

    const consensusRows = await prisma.consensusResponse.findMany({
      where: {
        rubricVersionId,
        status: 'SUBMITTED',
        institutionId: { in: institutionIds },
      },
      select: { entries: true },
    });

    const aggregated = aggregateConsensusEntriesFromRows(consensusRows);
    return res.json(aggregated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to aggregate consensus ratings' });
  }
});

/** Submitted consensus rows for an institution (project lead review only). */
router.get('/by-institution', async (req: Request, res: Response) => {
  try {
    const sessionUser = parseSessionUser(req);
    if (!sessionUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (sessionUser.role !== 'PROJECT_LEAD') {
      return res.status(403).json({ error: 'Forbidden' });
    }

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
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.json({
      consensuses: rows.map((row) => ({
        userId: row.userId,
        userName: row.user?.name ?? '',
        userEmail: row.user?.email ?? '',
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

    const record = await prisma.consensusResponse.findUnique({
      where: {
        userId_rubricVersionId: {
          userId: sessionUser.id,
          rubricVersionId,
        },
      },
    });

    if (!record) {
      return res.json({ consensus: null });
    }

    return res.json({
      consensus: {
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

type ScaleVersionWithBins = {
  id: string;
  rubricVersionId: string;
  prompt: string;
  isGlobal: boolean;
  scaleVersionBins: { predefinedBinId: string }[];
};

function normalizeOneEntry(
  entry: ConsensusEntryInput,
  scale: ScaleVersionWithBins,
  requireNonEmptyJustification: boolean
): ConsensusEntryInput {
  if (entry.score < SCORE_MIN || entry.score > SCORE_MAX) {
    throw new Error('Score must be between 0 and 4');
  }

  let normalizedBin = normalizePredefinedBinId(entry.predefinedBinId);
  if (scale.isGlobal) {
    normalizedBin = null;
  } else {
    if (!normalizedBin) {
      throw new Error('predefinedBinId is required for non-global scales');
    }
    const allowed = scale.scaleVersionBins.some((b) => b.predefinedBinId === normalizedBin);
    if (!allowed) {
      throw new Error('Invalid predefined bin for scale');
    }
  }

  if (requireNonEmptyJustification && !entry.justification.trim()) {
    throw new Error('Justification is required for each scale');
  }

  return {
    scaleVersionId: scale.id,
    predefinedBinId: normalizedBin,
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
        include: { scaleVersionBins: true },
      },
    },
  });
  if (!rubricVersion) {
    throw new Error('Rubric version not found');
  }

  const scaleById = new Map(
    rubricVersion.scaleVersions.map((sv) => [sv.id, sv as ScaleVersionWithBins])
  );

  const allScales = rubricVersion.scaleVersions as ScaleVersionWithBins[];

  return { scaleById, allScales };
}

async function normalizeDraftEntries(
  rubricVersionId: string,
  entries: ConsensusEntryInput[]
): Promise<ConsensusEntryInput[]> {
  const { scaleById, allScales } = await loadConsensusRubricScaleContext(rubricVersionId);
  const allowedIds = new Set(allScales.map((s) => s.id));

  const normalized: ConsensusEntryInput[] = [];
  for (const entry of entries) {
    const scale = scaleById.get(entry.scaleVersionId);
    if (!scale || scale.rubricVersionId !== rubricVersionId) {
      throw new Error('Invalid scale version id in entries');
    }
    if (!allowedIds.has(scale.id)) {
      throw new Error('Entry for a scale that is not part of this rubric version');
    }
    normalized.push(normalizeOneEntry(entry, scale, false));
  }
  return normalized;
}

async function normalizeSubmitEntries(
  rubricVersionId: string,
  entries: ConsensusEntryInput[]
): Promise<ConsensusEntryInput[]> {
  const { scaleById, allScales } = await loadConsensusRubricScaleContext(rubricVersionId);

  const entryByScaleId = new Map(entries.map((e) => [e.scaleVersionId, e]));
  const allowedIds = new Set(allScales.map((s) => s.id));

  const normalized: ConsensusEntryInput[] = [];
  for (const scale of allScales) {
    const entry = entryByScaleId.get(scale.id);
    if (!entry) {
      throw new Error(`Missing consensus entry for: ${scale.prompt.slice(0, 120)}`);
    }
    normalized.push(normalizeOneEntry(entry, scale, true));
  }

  for (const entry of entries) {
    const scale = scaleById.get(entry.scaleVersionId);
    if (!scale || scale.rubricVersionId !== rubricVersionId) {
      throw new Error('Invalid scale version id in entries');
    }
    if (!allowedIds.has(scale.id)) {
      throw new Error('Entry for a scale that is not part of this rubric version');
    }
  }

  return normalized;
}

router.post('/save-draft', async (req: Request, res: Response) => {
  try {
    const sessionUser = requireLocalLeaderWithInstitution(req, res);
    if (!sessionUser) return;

    const { rubricVersionId, entries: rawEntries } = req.body as {
      rubricVersionId?: string;
      entries?: unknown;
    };

    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const existing = await prisma.consensusResponse.findUnique({
      where: {
        userId_rubricVersionId: { userId: sessionUser.id, rubricVersionId },
      },
    });
    if (existing?.status === 'SUBMITTED') {
      return res.status(400).json({ error: 'Submitted consensus cannot be edited' });
    }

    const entriesInput = rawEntries === undefined ? [] : parseConsensusEntries(rawEntries);
    const entries =
      entriesInput.length === 0 ? [] : await normalizeDraftEntries(rubricVersionId, entriesInput);

    await prisma.consensusResponse.upsert({
      where: {
        userId_rubricVersionId: { userId: sessionUser.id, rubricVersionId },
      },
      create: {
        userId: sessionUser.id,
        institutionId: sessionUser.institutionId,
        rubricVersionId,
        status: 'DRAFT',
        entries: entries as object[],
        submittedAt: null,
      },
      update: {
        status: 'DRAFT',
        entries: entries as object[],
        submittedAt: null,
      },
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

    const { rubricVersionId, entries: rawEntries } = req.body as {
      rubricVersionId?: string;
      entries?: unknown;
    };

    if (!rubricVersionId) {
      return res.status(400).json({ error: 'rubricVersionId is required' });
    }

    const existing = await prisma.consensusResponse.findUnique({
      where: {
        userId_rubricVersionId: { userId: sessionUser.id, rubricVersionId },
      },
    });
    if (existing?.status === 'SUBMITTED') {
      return res.status(400).json({ error: 'Consensus already submitted' });
    }

    const entriesInput = parseConsensusEntries(rawEntries ?? []);
    const entries = await normalizeSubmitEntries(rubricVersionId, entriesInput);

    await prisma.consensusResponse.upsert({
      where: {
        userId_rubricVersionId: { userId: sessionUser.id, rubricVersionId },
      },
      create: {
        userId: sessionUser.id,
        institutionId: sessionUser.institutionId,
        rubricVersionId,
        status: 'SUBMITTED',
        entries: entries as object[],
        submittedAt: new Date(),
      },
      update: {
        status: 'SUBMITTED',
        entries: entries as object[],
        submittedAt: new Date(),
      },
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
