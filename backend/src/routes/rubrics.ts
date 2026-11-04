import {
  buildResponseExportWhere,
  fetchResponseExportRows,
  filterResponseContextKeysToPathwayIds,
  getResponseExportCsvHeader,
  redactResponseExportRowsForCollegeLead,
  RESPONSE_EXPORT_ALL_SCALES,
  RESPONSE_EXPORT_ALL_SECTIONS,
  responseExportRowsToCsvStrings,
} from '@lib/buildResponseExport';
import { encodeCsvDocument } from '@lib/csvEncoding';
import { sendReminderEmail } from '@lib/mailer';
import { ensureRubricVersionForRubric, findLatestRubricVersionId } from '@lib/rubricVersion';
import { AssignmentStatus, prisma } from '@lib/prisma';
import type { Prisma } from '@lib/prisma';
import { compareRubricsByNumber, parseRubricNumberFromTitle } from '@shared/rubricNumber';
import {
  GENERAL_PATHWAY_ID,
  ensureGeneralPathwayId,
  isGeneralPathwayId,
  isPathwayId,
  resolvePathwayId,
} from '@shared/pathways';
import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

type SessionUser = {
  id: string;
  role: string;
  institutionId: string | null;
};

function parseSessionUser(req: Request): SessionUser | null {
  if (!req.user) {
    return null;
  }
  const user = req.user as { id?: string; role?: string; institutionId?: string | null };
  if (!user.id || !user.role) {
    return null;
  }

  return {
    id: user.id,
    role: user.role,
    institutionId: user.institutionId ?? null,
  };
}

function requireLeadOrProjectLeadSession(req: Request, res: Response): SessionUser | null {
  const sessionUser = parseSessionUser(req);

  if (!sessionUser) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  if (!['PROJECT_LEAD', 'LOCAL_LEADER'].includes(sessionUser.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return sessionUser;
}

type DraftResponseInput = {
  scaleVersionId: string;
  rubricVersionId: string;
  score: number;
  justification?: string | null;
};

type ResponseScope = {
  userId: string;
  rubricVersionId: string;
  pathwayId: string;
};

type RubricAssignmentMode = 'general' | 'perUserContexts';

type PerUserContextAssignmentRow = {
  userId: string;
  rubricId: string;
  includeGeneral?: boolean | undefined;
  pathwayIds: string[];
};

type NewUserAssignment = {
  userId: string;
  rubricVersionId: string;
  pathwayId: string;
  status: AssignmentStatus;
};

type AssignmentBuildResult = { assignments: NewUserAssignment[] } | { error: string };

const JUSTIFICATION_REQUIRED_ERROR = 'Justification is required for each criterion';
const LEVEL_DESCRIPTIONS_REQUIRED_ERROR = 'Level descriptions are required';
const GRAVEYARD_SECTION_PREFIX = '__GRAVEYARD__::';
const DEFAULT_SECTION_NAME = 'General';
const INCOMPLETE_ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  AssignmentStatus.ASSIGNED,
  AssignmentStatus.IN_PROGRESS,
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeOptionalJustification(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function requireJustification(value: unknown): string {
  const normalized = normalizeOptionalJustification(value);
  if (!normalized) {
    throw new Error(JUSTIFICATION_REQUIRED_ERROR);
  }
  return normalized;
}

function buildResponseScope(args: ResponseScope) {
  return {
    userId: args.userId,
    rubricVersionId: args.rubricVersionId,
    pathwayId: args.pathwayId,
  };
}

function isRubricIdUuid(value: string): boolean {
  return value.length > 0;
}

function isGraveyardSection(section: string | null): boolean {
  return typeof section === 'string' && section.startsWith(GRAVEYARD_SECTION_PREFIX);
}

function toGraveyardSection(section: string | null | undefined): string {
  const normalizedSection = (section ?? DEFAULT_SECTION_NAME).trim();
  const sectionName = normalizedSection.length > 0 ? normalizedSection : DEFAULT_SECTION_NAME;
  return `${GRAVEYARD_SECTION_PREFIX}${sectionName}`;
}

function fromGraveyardSection(section: string | null): string | null {
  if (!isGraveyardSection(section)) {
    return section;
  }
  const parsedSection = (section as string).slice(GRAVEYARD_SECTION_PREFIX.length).trim();
  return parsedSection.length === 0 ? DEFAULT_SECTION_NAME : parsedSection;
}

async function assertSavedDraftJustifications(args: {
  userId: string;
  rubricVersionId: string;
  pathwayId: string;
  coveredScaleVersionIds: Set<string>;
}) {
  const drafts = await prisma.response.findMany({
    where: { ...buildResponseScope(args), status: 'DRAFT' },
    select: {
      scaleVersionId: true,
      justification: true,
      scaleVersion: { select: { section: true } },
    },
  });

  for (const draft of drafts) {
    if (isGraveyardSection(draft.scaleVersion.section)) continue;
    if (args.coveredScaleVersionIds.has(draft.scaleVersionId)) continue;
    requireJustification(draft.justification);
  }
}

async function saveScopedResponse(
  tx: Prisma.TransactionClient,
  args: {
    scope: ResponseScope;
    row: DraftResponseInput;
    status: 'DRAFT' | 'SUBMITTED';
    justification: string | null;
    submittedAt?: Date;
  }
) {
  const { scope, row, status, justification, submittedAt } = args;
  const scaleVersion = await tx.scaleVersion.findUnique({ where: { id: row.scaleVersionId } });
  if (!scaleVersion || scaleVersion.rubricVersionId !== row.rubricVersionId) {
    throw new Error('Invalid scale version for rubric version');
  }

  const existing = await tx.response.findFirst({
    where: { ...buildResponseScope(scope), scaleVersionId: row.scaleVersionId },
  });
  const data = {
    score: row.score,
    status,
    justification,
    ...(submittedAt ? { submittedAt } : {}),
  };

  if (existing) {
    await tx.response.update({ where: { id: existing.id }, data });
    return;
  }
  await tx.response.create({
    data: { ...buildResponseScope(scope), scaleVersionId: row.scaleVersionId, ...data },
  });
}

type ScalePayloadSource = {
  id: string;
  prompt: string;
  section: string | null;
  orderIndex: number;
  editable: boolean;
  isGlobal: boolean;
  levelDescriptions: unknown;
};

function toScalePayload(scale: ScalePayloadSource) {
  return {
    id: scale.id,
    prompt: scale.prompt,
    section: scale.section,
    orderIndex: scale.orderIndex,
    editable: scale.editable,
    isGlobal: scale.isGlobal,
    levelDescriptions: scale.levelDescriptions,
  };
}

function toScaleVersionPayload(scaleVersion: ScalePayloadSource & { originalScaleId: string }) {
  return {
    ...toScalePayload(scaleVersion),
    originalScaleId: scaleVersion.originalScaleId, // needed for writes
  };
}

function toRubricPathwayIds(rows: { pathwayId: string }[]): string[] {
  return ensureGeneralPathwayId(rows.map((row) => row.pathwayId));
}

function toAssignmentView<T extends object>(assignment: {
  pathwayId: string;
  pathway: { name: string };
  rubricVersion: T;
}) {
  return {
    ...assignment.rubricVersion,
    pathwayId: assignment.pathwayId,
    pathwayName: assignment.pathway.name,
    isGeneralPathway: isGeneralPathwayId(assignment.pathwayId),
  };
}

function parseRubricVersionIdsFromQuery(raw: unknown): string[] | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined;
  }
  const ids = raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return ids.length > 0 ? ids : undefined;
}

/** Undefined = omit filter (all contexts). Empty array = explicit “none”. */
function parseResponseContextKeysFromQuery(raw: unknown): string[] | undefined {
  if (typeof raw !== 'string') {
    return undefined;
  }
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function hasOnlyValidResponseContextKeys(keys: string[]): boolean {
  return keys.every((key) => filterResponseContextKeysToPathwayIds([key]).length === 1);
}

function sendEmptyExport(res: Response, format: 'csv' | 'json') {
  if (format === 'json') {
    return res.json([]);
  }
  const emptyCsv = encodeCsvDocument(getResponseExportCsvHeader(), []);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="responses-empty.csv"');
  return res.send(emptyCsv);
}

router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    const rubrics = await prisma.rubric.findMany({
      include: {
        // Used only as a fallback if a rubric has no versions yet.
        scales: true,
        pathways: { select: { pathwayId: true } },
        // All versions (id + num) for filters/export; scales still come from latest only.
        versions: {
          orderBy: { versionNum: 'desc' },
          select: { id: true, versionNum: true },
        },
      },
    });

    const latestRubricVersionIds = rubrics
      .map((rubric) => rubric.versions[0]?.id)
      .filter((id): id is string => Boolean(id));

    const scaleVersionsByRubricVersionId = new Map<
      string,
      Awaited<ReturnType<typeof prisma.scaleVersion.findMany>>
    >();

    if (latestRubricVersionIds.length > 0) {
      const latestScaleVersions = await prisma.scaleVersion.findMany({
        where: { rubricVersionId: { in: latestRubricVersionIds } },
        orderBy: { orderIndex: 'asc' },
      });
      for (const row of latestScaleVersions) {
        const list = scaleVersionsByRubricVersionId.get(row.rubricVersionId) ?? [];
        list.push(row);
        scaleVersionsByRubricVersionId.set(row.rubricVersionId, list);
      }
    }

    const formattedRubrics = rubrics.map((rubric) => {
      const latestVersionId = rubric.versions[0]?.id;
      const scaleVersions = latestVersionId
        ? (scaleVersionsByRubricVersionId.get(latestVersionId) ?? [])
        : [];

      const scaleSources: ScalePayloadSource[] =
        scaleVersions.length > 0
          ? scaleVersions
          : [...rubric.scales].sort((a, b) => a.orderIndex - b.orderIndex);
      const scales = scaleSources
        .filter((scale) => !isGraveyardSection(scale.section))
        .map(toScalePayload);

      return {
        id: rubric.id,
        title: rubric.title,
        description: rubric.description,
        active: rubric.active,
        pathwayIds: toRubricPathwayIds(rubric.pathways),
        scales,
        versions: rubric.versions.map((v) => ({ id: v.id, versionNum: v.versionNum })),
      };
    });

    res.json(formattedRubrics.sort((a, b) => a.title.localeCompare(b.title)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubrics' });
  }
});

/**
 * Registered with other static GET paths before `/:rubricId` so this path is never captured as a UUID param.
 * Submitted responses only, merged with rubric/scale/user/institution/pathway context.
 * Query: rubricId (required), sectionKey, scaleId (scale version id from latest template, or __all_scales__),
 * rubricVersionIds (optional comma-separated rubric version row UUIDs; omit for all versions), format=csv|json
 */
router.get('/response-export', async (req: Request, res: Response) => {
  const sessionUser = requireLeadOrProjectLeadSession(req, res);
  if (!sessionUser) {
    return;
  }

  const rubricIdRaw = req.query.rubricId;
  const rubricId = typeof rubricIdRaw === 'string' ? rubricIdRaw : '';
  if (!rubricId) {
    return res.status(400).json({ error: 'Missing rubricId' });
  }

  const sectionKeyRaw = req.query.sectionKey;
  const sectionKey =
    typeof sectionKeyRaw === 'string' && sectionKeyRaw.length > 0
      ? sectionKeyRaw
      : RESPONSE_EXPORT_ALL_SECTIONS;

  const scaleIdRaw = req.query.scaleId;
  const scaleVersionId =
    typeof scaleIdRaw === 'string' && scaleIdRaw.length > 0
      ? scaleIdRaw
      : RESPONSE_EXPORT_ALL_SCALES;

  const formatRaw = req.query.format;
  const format =
    typeof formatRaw === 'string' && formatRaw.toLowerCase() === 'json' ? 'json' : 'csv';

  if (sessionUser.role === 'LOCAL_LEADER' && !sessionUser.institutionId) {
    return sendEmptyExport(res, format);
  }

  const institutionIdScope = sessionUser.role === 'LOCAL_LEADER' ? sessionUser.institutionId : null;

  const rubricVersionIds = parseRubricVersionIdsFromQuery(req.query.rubricVersionIds);
  const responseContextKeys = parseResponseContextKeysFromQuery(req.query.responseContextKeys);

  if (responseContextKeys !== undefined && responseContextKeys.length === 0) {
    return sendEmptyExport(res, format);
  }

  if (
    responseContextKeys !== undefined &&
    sessionUser.role === 'LOCAL_LEADER' &&
    !hasOnlyValidResponseContextKeys(responseContextKeys)
  ) {
    return res.status(400).json({ error: 'Invalid response context' });
  }

  try {
    const built = await buildResponseExportWhere({
      rubricId,
      sectionKey,
      scaleVersionId,
      institutionIdScope,
      ...(rubricVersionIds !== undefined ? { rubricVersionIds } : {}),
      ...(responseContextKeys !== undefined ? { responseContextKeys } : {}),
    });

    if ('error' in built) {
      return res.status(400).json({ error: built.error });
    }

    const fetchedRows = await fetchResponseExportRows(built.where);
    const rows =
      sessionUser.role === 'LOCAL_LEADER'
        ? redactResponseExportRowsForCollegeLead(fetchedRows)
        : fetchedRows;
    if (format === 'json') {
      return res.json(rows);
    }

    const csvBody = encodeCsvDocument(
      getResponseExportCsvHeader(),
      responseExportRowsToCsvStrings(rows)
    );
    const safeStamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="rubric-responses-${safeStamp}.csv"`
    );
    return res.send(csvBody);
  } catch (error) {
    console.error('response-export failed', error);
    const details = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: 'Failed to build export', details });
  }
});

type UserAssignmentsHandlerArgs = {
  status: AssignmentStatus;
  orderField: 'assignedAt' | 'startedAt' | 'completedAt';
  errorMessage: string;
};

function createUserAssignmentsHandler(args: UserAssignmentsHandlerArgs) {
  return async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const assignments = await prisma.userRubricAssignment.findMany({
        where: { userId, status: args.status },
        include: {
          pathway: { select: { id: true, name: true } },
          rubricVersion: { include: { rubric: true, scaleVersions: true } },
        },
        orderBy: { [args.orderField]: 'desc' },
      });
      return res.json(assignments.map(toAssignmentView));
    } catch (error) {
      return res.status(500).json({ error: args.errorMessage });
    }
  };
}

router.get(
  '/assigned/:userId',
  createUserAssignmentsHandler({
    status: AssignmentStatus.ASSIGNED,
    orderField: 'assignedAt',
    errorMessage: 'Failed to fetch assigned rubrics',
  })
);

router.get(
  '/inprogress/:userId',
  createUserAssignmentsHandler({
    status: AssignmentStatus.IN_PROGRESS,
    orderField: 'startedAt',
    errorMessage: 'Failed to fetch assigned rubrics',
  })
);

router.get(
  '/completed/:userId',
  createUserAssignmentsHandler({
    status: AssignmentStatus.COMPLETED,
    orderField: 'completedAt',
    errorMessage: 'Failed to fetch completed rubrics',
  })
);

function parseRubricIdsFromBody(args: { rubricId: unknown; rubricIds: unknown }): string[] {
  if (Array.isArray(args.rubricIds) && args.rubricIds.length > 0) {
    return [...new Set(args.rubricIds.filter(isNonEmptyString))];
  }
  return isNonEmptyString(args.rubricId) ? [args.rubricId] : [];
}

function parseAssignmentMode(value: unknown): RubricAssignmentMode | null {
  const rawMode = typeof value === 'string' ? value : '';
  if (rawMode === '' || rawMode === 'global' || rawMode === 'general') return 'general';
  return rawMode === 'perUserContexts' ? rawMode : null;
}

function parsePerUserContextRow(
  value: unknown,
  fallbackRubricId: string | null
): PerUserContextAssignmentRow | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as {
    userId?: unknown;
    rubricId?: unknown;
    includeGeneral?: unknown;
    pathwayIds?: unknown;
  };
  const rubricId = typeof row.rubricId === 'string' ? row.rubricId : fallbackRubricId;
  if (typeof row.userId !== 'string' || !rubricId) return null;
  if (row.includeGeneral !== undefined && typeof row.includeGeneral !== 'boolean') return null;
  if (row.pathwayIds !== undefined && !Array.isArray(row.pathwayIds)) return null;

  return {
    userId: row.userId,
    rubricId,
    includeGeneral: row.includeGeneral,
    pathwayIds: (row.pathwayIds as unknown[] | undefined)?.filter(isNonEmptyString) ?? [],
  };
}

function parsePerUserContextRows(
  assignments: unknown,
  fallbackRubricId: string | null
): PerUserContextAssignmentRow[] {
  if (!Array.isArray(assignments)) return [];
  return assignments
    .map((assignment) => parsePerUserContextRow(assignment, fallbackRubricId))
    .filter((row): row is PerUserContextAssignmentRow => row !== null);
}

/** Missing context defaults to General unless includeGeneral is explicitly false. */
function resolveContextPathwayIds(row: PerUserContextAssignmentRow): string[] {
  const requestedPathwayIds = row.pathwayIds.map((pathwayId) => resolvePathwayId(pathwayId));
  const shouldIncludeGeneral =
    row.includeGeneral === true ||
    (row.includeGeneral !== false && requestedPathwayIds.length === 0);
  const pathwayIds = shouldIncludeGeneral
    ? [GENERAL_PATHWAY_ID, ...requestedPathwayIds]
    : requestedPathwayIds;
  return [...new Set(pathwayIds)];
}

function findInvalidPathwayError(args: {
  pathwayIds: string[];
  allowedPathwayIds: Set<string>;
}): string | null {
  for (const pathwayId of args.pathwayIds) {
    if (!isPathwayId(pathwayId)) return 'Invalid pathway id in assignment context';
    if (!args.allowedPathwayIds.has(pathwayId)) {
      return 'Per-user context assignment must use pathways linked to the rubric';
    }
  }
  return null;
}

function buildPerUserContextAssignments(args: {
  rows: PerUserContextAssignmentRow[];
  rubricVersionIdByRubricId: Map<string, string>;
  allowedPathwayIdsByRubricId: Map<string, Set<string>>;
  knownUserIds: Set<string>;
}): AssignmentBuildResult {
  if (args.rows.length === 0) {
    return { error: 'assignments is required for perUserContexts mode' };
  }

  const assignments: NewUserAssignment[] = [];
  for (const row of args.rows) {
    const rubricVersionId = args.rubricVersionIdByRubricId.get(row.rubricId);
    if (!rubricVersionId) return { error: 'Invalid rubric in per-user assignment rows' };
    if (!args.knownUserIds.has(row.userId)) {
      return { error: 'Invalid user in per-user assignment rows' };
    }

    const pathwayIds = resolveContextPathwayIds(row);
    if (pathwayIds.length === 0) {
      return { error: 'Each user must have at least one assignment context' };
    }
    const allowedPathwayIds = args.allowedPathwayIdsByRubricId.get(row.rubricId) ?? new Set();
    const pathwayError = findInvalidPathwayError({ pathwayIds, allowedPathwayIds });
    if (pathwayError) return { error: pathwayError };

    for (const pathwayId of pathwayIds) {
      assignments.push({
        userId: row.userId,
        rubricVersionId,
        pathwayId,
        status: AssignmentStatus.ASSIGNED,
      });
    }
  }
  return { assignments };
}

function buildGeneralAssignments(args: {
  userIds: string[];
  rubricVersionIds: string[];
}): NewUserAssignment[] {
  return args.userIds.flatMap((userId) =>
    args.rubricVersionIds.map((rubricVersionId) => ({
      userId,
      rubricVersionId,
      pathwayId: GENERAL_PATHWAY_ID,
      status: AssignmentStatus.ASSIGNED,
    }))
  );
}

function dedupeAssignments(assignments: NewUserAssignment[]): NewUserAssignment[] {
  return [
    ...new Map(
      assignments.map((assignment) => [
        `${assignment.userId}:${assignment.rubricVersionId}:${assignment.pathwayId}`,
        assignment,
      ])
    ).values(),
  ];
}

async function loadAllowedPathwayIdsByRubricId(
  rubricIds: string[]
): Promise<Map<string, Set<string>>> {
  const rows = await prisma.rubricPathway.findMany({
    where: { rubricId: { in: rubricIds } },
    select: { rubricId: true, pathwayId: true },
  });
  return new Map(
    rubricIds.map((rubricId) => [
      rubricId,
      new Set(
        toRubricPathwayIds(rows.filter((row) => row.rubricId === rubricId))
      ),
    ])
  );
}

async function loadRubricVersionIdByRubricId(
  rubricIds: string[]
): Promise<Map<string, string> | null> {
  const rubricVersionIdByRubricId = new Map<string, string>();
  for (const rubricId of rubricIds) {
    const rubricVersionId = await ensureRubricVersionForRubric(rubricId);
    if (!rubricVersionId) return null;
    rubricVersionIdByRubricId.set(rubricId, rubricVersionId);
  }
  return rubricVersionIdByRubricId;
}

router.post('/assign', async (req: Request, res: Response) => {
  try {
    const { rubricId, rubricIds: rubricIdsBody, userIds, mode, assignments } = req.body as {
      rubricId?: unknown;
      rubricIds?: unknown;
      userIds?: unknown;
      mode?: unknown;
      assignments?: unknown;
    };

    const rubricIds = parseRubricIdsFromBody({ rubricId, rubricIds: rubricIdsBody });
    if (rubricIds.length === 0) {
      return res.status(400).json({ error: 'rubricId or non-empty rubricIds is required' });
    }

    const rubricsFound = await prisma.rubric.findMany({ where: { id: { in: rubricIds } } });
    if (rubricsFound.length !== rubricIds.length) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }

    const assignmentMode = parseAssignmentMode(mode);
    if (!assignmentMode) {
      return res.status(400).json({ error: 'Unsupported assignment mode' });
    }

    const perUserContextRows =
      assignmentMode === 'perUserContexts'
        ? parsePerUserContextRows(assignments, rubricIds.length === 1 ? rubricIds[0]! : null)
        : [];

    const requestedUserIds =
      assignmentMode === 'perUserContexts'
        ? [...new Set(perUserContextRows.map((row) => row.userId))]
        : Array.isArray(userIds)
          ? [...new Set(userIds.filter((id): id is string => typeof id === 'string'))]
          : [];

    if (requestedUserIds.length === 0) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }

    const users = await prisma.user.findMany({
      where: { id: { in: requestedUserIds } },
      select: { id: true },
    });
    if (users.length === 0) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }

    const rubricVersionIdByRubricId = await loadRubricVersionIdByRubricId(rubricIds);
    if (!rubricVersionIdByRubricId) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    let userAssignments: NewUserAssignment[];
    if (assignmentMode === 'perUserContexts') {
      const built = buildPerUserContextAssignments({
        rows: perUserContextRows,
        rubricVersionIdByRubricId,
        allowedPathwayIdsByRubricId: await loadAllowedPathwayIdsByRubricId(rubricIds),
        knownUserIds: new Set(users.map((user) => user.id)),
      });
      if ('error' in built) {
        return res.status(400).json({ error: built.error });
      }
      userAssignments = built.assignments;
    } else {
      userAssignments = buildGeneralAssignments({
        userIds: users.map((user) => user.id),
        rubricVersionIds: [...rubricVersionIdByRubricId.values()],
      });
    }

    if (userAssignments.length === 0) {
      return res.json({ message: 'No new rubric assignments were created' });
    }

    const createResult = await prisma.userRubricAssignment.createMany({
      data: dedupeAssignments(userAssignments),
      skipDuplicates: true,
    });

    if (createResult.count === 0) {
      return res.json({ message: 'No new rubric assignments were created' });
    }

    res.json({ message: 'Rubrics assigned successfully' });
  } catch (error) {
    console.error('Failed to assign rubrics', error);
    res.status(500).json({ error: 'Failed to assign rubrics', details: error });
  }
});

router.post('/assignments/remind', async (req: Request, res: Response) => {
  const sessionUser = requireLeadOrProjectLeadSession(req, res);
  if (!sessionUser) {
    return;
  }

  try {
    const { userId, rubricId, pathwayId } = req.body as {
      userId?: unknown;
      rubricId?: unknown;
      pathwayId?: unknown;
    };
    if (!isNonEmptyString(userId) || !isNonEmptyString(rubricId)) {
      return res.status(400).json({ error: 'userId and rubricId are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (
      sessionUser.role === 'LOCAL_LEADER' &&
      (!sessionUser.institutionId || user.institutionId !== sessionUser.institutionId)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const assignmentWhere = {
      userId,
      pathwayId: resolvePathwayId(pathwayId),
      rubricVersion: { is: { rubricId } },
    };
    const assignment = await prisma.userRubricAssignment.findFirst({
      where: { ...assignmentWhere, status: { in: INCOMPLETE_ASSIGNMENT_STATUSES } },
      include: {
        pathway: { select: { name: true } },
        rubricVersion: { select: { rubric: { select: { title: true } } } },
      },
      orderBy: { rubricVersion: { versionNum: 'desc' } },
    });

    if (!assignment) {
      const completedAssignment = await prisma.userRubricAssignment.findFirst({
        where: assignmentWhere,
        select: { id: true },
      });
      return completedAssignment
        ? res.status(409).json({ error: 'Assignment is already completed' })
        : res.status(404).json({ error: 'Rubric assignment not found for selected context' });
    }

    await sendReminderEmail({
      toEmail: user.email,
      rubricTitle: assignment.rubricVersion.rubric.title,
      pathwayName: assignment.pathway.name,
    });

    if (sessionUser.role === 'PROJECT_LEAD') {
      return res.json({ sent: true, aliasName: user.aliasName });
    }
    return res.json({ sent: true });
  } catch (error) {
    console.error('Failed to send assignment reminder', error);
    return res.status(500).json({ error: 'Failed to send reminder' });
  }
});

router.post('/unassign', async (req: Request, res: Response) => {
  const sessionUser = requireLeadOrProjectLeadSession(req, res);
  if (!sessionUser) {
    return;
  }

  try {
    const { rubricId, userId, pathwayId } = req.body as {
      rubricId?: string;
      userId?: string;
      pathwayId?: unknown;
    };

    if (!rubricId || !userId) {
      return res.status(400).json({ error: 'rubricId and userId are required' });
    }

    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!rubric || !user) {
      return res.status(404).json({ error: 'Rubric or user not found' });
    }

    if (
      sessionUser.role === 'LOCAL_LEADER' &&
      (!sessionUser.institutionId || user.institutionId !== sessionUser.institutionId)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const rubricVersionId = await findLatestRubricVersionId(rubricId);
    if (!rubricVersionId) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const resolvedPathwayId = resolvePathwayId(pathwayId);
    const assignment = await prisma.userRubricAssignment.findFirst({
      where: { userId, rubricVersionId, pathwayId: resolvedPathwayId },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Rubric assignment not found for selected context' });
    }

    if (assignment.status === AssignmentStatus.COMPLETED) {
      return res.status(409).json({ error: 'Cannot unassign a submitted rubric' });
    }

    await prisma.userRubricAssignment.deleteMany({
      where: { userId, rubricVersionId, pathwayId: resolvedPathwayId },
    });

    res.json({ message: 'Rubric unassigned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unassign rubric' });
  }
});

router.post('/start', async (req: Request, res: Response) => {
  try {
    const { rubricVersionId, userId, pathwayId } = req.body as {
      rubricVersionId?: string;
      userId?: string;
      pathwayId?: unknown;
    };
    if (!rubricVersionId || !userId) {
      return res.status(400).json({ error: 'rubricVersionId and userId are required' });
    }
    const rubric = await prisma.rubricVersion.findUnique({ where: { id: rubricVersionId } });
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updateResult = await prisma.userRubricAssignment.updateMany({
      where: { userId, rubricVersionId, pathwayId: resolvePathwayId(pathwayId) },
      data: { status: AssignmentStatus.IN_PROGRESS, startedAt: new Date() },
    });
    if (updateResult.count === 0) {
      return res.status(404).json({ error: 'Rubric assignment not found for selected context' });
    }
    res.json({ message: 'Rubric started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start rubric', details: JSON.stringify(error) });
  }
});

router.post('/complete', async (req: Request, res: Response) => {
  try {
    const { rubricId, userId, pathwayId } = req.body as {
      rubricId?: string;
      userId?: string;
      pathwayId?: unknown;
    };
    if (!rubricId || !userId) {
      return res.status(400).json({ error: 'rubricId and userId are required' });
    }
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!rubric || !user) {
      return res.status(404).json({ error: 'Rubric or user not found' });
    }
    const rubricVersionId = await findLatestRubricVersionId(rubricId);
    if (!rubricVersionId) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }
    const updateResult = await prisma.userRubricAssignment.updateMany({
      where: { userId, rubricVersionId, pathwayId: resolvePathwayId(pathwayId) },
      data: { status: AssignmentStatus.COMPLETED },
    });
    if (updateResult.count === 0) {
      return res.status(404).json({ error: 'Rubric assignment not found for selected context' });
    }
    res.json({ message: 'Rubric completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete rubric' });
  }
});

type IncomingScale = {
  originalScaleId?: string;
  prompt: string;
  orderIndex: number;
  isGlobal: boolean;
  editable: boolean;
  section?: string | null;
  levelDescriptions?: unknown;
  isGraveyard: boolean;
};

async function syncRubricPathways(
  tx: Prisma.TransactionClient,
  args: { rubricId: string; pathwayIds: unknown }
) {
  const requestedPathwayIds = Array.isArray(args.pathwayIds)
    ? args.pathwayIds.filter((pathwayId): pathwayId is string => typeof pathwayId === 'string')
    : [];
  const pathwayIds = ensureGeneralPathwayId(requestedPathwayIds);

  await tx.rubricPathway.deleteMany({
    where: { rubricId: args.rubricId, pathwayId: { notIn: pathwayIds } },
  });
  await tx.rubricPathway.createMany({
    data: pathwayIds.map((pathwayId) => ({ rubricId: args.rubricId, pathwayId })),
    skipDuplicates: true,
  });
}

async function syncLiveScales(
  tx: Prisma.TransactionClient,
  args: { rubricId: string; incomingScales: IncomingScale[] }
) {
  const liveScales = await tx.scale.findMany({
    where: { rubricId: args.rubricId },
    select: { id: true, section: true },
  });
  const liveScaleById = new Map(liveScales.map((scale) => [scale.id, scale]));
  const keptLiveScaleIds = new Set<string>();

  for (const scale of args.incomingScales) {
    const scaleData = {
      prompt: scale.prompt,
      orderIndex: scale.orderIndex,
      isGlobal: true,
      editable: scale.editable,
      section: scale.isGraveyard ? toGraveyardSection(scale.section) : (scale.section ?? null),
      levelDescriptions: scale.levelDescriptions as Prisma.InputJsonValue,
    };

    if (scale.originalScaleId && liveScaleById.has(scale.originalScaleId)) {
      keptLiveScaleIds.add(scale.originalScaleId);
      await tx.scale.update({ where: { id: scale.originalScaleId }, data: scaleData });
      continue;
    }

    const createdScale = await tx.scale.create({
      data: { rubricId: args.rubricId, ...scaleData },
      select: { id: true },
    });
    keptLiveScaleIds.add(createdScale.id);
  }

  for (const liveScale of liveScales) {
    if (keptLiveScaleIds.has(liveScale.id)) continue;
    await tx.scale.update({
      where: { id: liveScale.id },
      data: { section: toGraveyardSection(liveScale.section) },
    });
  }
}

async function snapshotLiveScales(
  tx: Prisma.TransactionClient,
  args: { rubricId: string; rubricVersionId: string }
) {
  const liveScales = await tx.scale.findMany({ where: { rubricId: args.rubricId } });

  for (const liveScale of liveScales) {
    if (isGraveyardSection(liveScale.section)) continue;
    if (liveScale.levelDescriptions === null) {
      throw new Error(LEVEL_DESCRIPTIONS_REQUIRED_ERROR);
    }
    await tx.scaleVersion.create({
      data: {
        rubricVersionId: args.rubricVersionId,
        originalScaleId: liveScale.id,
        prompt: liveScale.prompt,
        orderIndex: liveScale.orderIndex,
        isGlobal: liveScale.isGlobal,
        editable: liveScale.editable,
        section: liveScale.section,
        levelDescriptions: liveScale.levelDescriptions,
      },
    });
  }
}

router.post('/update/:rubricId', async (req: Request, res: Response) => {
  try {
    const { rubricId } = req.params as { rubricId: string };
    const { updatedRubric, changelog } = req.body;

    if (!updatedRubric) {
      return res.status(400).json({ error: 'updatedRubric is required', received: req.body });
    }
    const { scales, graveyardScales, id, versions, pathwayIds, ...rubricFields } = updatedRubric;
    if (!Array.isArray(scales)) {
      return res.status(400).json({ error: 'updatedRubric.scales must be an array' });
    }
    if (graveyardScales !== undefined && !Array.isArray(graveyardScales)) {
      return res.status(400).json({ error: 'updatedRubric.graveyardScales must be an array' });
    }

    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric not found' });
    }

    const latest = await prisma.rubricVersion.findFirst({
      where: { rubricId },
      orderBy: { versionNum: 'desc' },
    });
    if (!latest) {
      return res.status(404).json({ error: 'No existing version found' });
    }

    const incomingScales: IncomingScale[] = [
      ...(scales as Omit<IncomingScale, 'isGraveyard'>[]).map((scale) => ({
        ...scale,
        isGraveyard: false,
      })),
      ...((graveyardScales ?? []) as Omit<IncomingScale, 'isGraveyard'>[]).map((scale) => ({
        ...scale,
        isGraveyard: true,
      })),
    ];

    await prisma.$transaction(async (tx) => {
      // 1. Update rubric metadata and pathway links
      await tx.rubric.update({ where: { id: rubricId }, data: rubricFields });
      if (pathwayIds !== undefined) {
        await syncRubricPathways(tx, { rubricId, pathwayIds });
      }

      // 2. Sync incoming scales to live Scale rows
      await syncLiveScales(tx, { rubricId, incomingScales });

      // 3. Create the new RubricVersion
      const newVersion = await tx.rubricVersion.create({
        data: { rubricId, versionNum: latest.versionNum + 1, changelog },
      });

      // 4. Snapshot all live scales into ScaleVersion
      await snapshotLiveScales(tx, { rubricId, rubricVersionId: newVersion.id });

      // 5. Migrate ASSIGNED users to the new version
      await tx.userRubricAssignment.updateMany({
        where: { rubricVersionId: latest.id, status: 'ASSIGNED' },
        data: { rubricVersionId: newVersion.id },
      });
    });

    res.json({ message: 'Rubric updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === LEVEL_DESCRIPTIONS_REQUIRED_ERROR) {
      return res.status(400).json({ error: message });
    }
    console.error('Failed to update rubric', error);
    res.status(500).json({ error: 'Failed to update rubric' });
  }
});

router.get('/version/:rubricVersionId', async (req: Request, res: Response) => {
  try {
    const { rubricVersionId } = req.params as { rubricVersionId: string };
    if (!rubricVersionId) {
      return res.status(400).json({ error: 'Rubric version ID is required' });
    }
    const rubricVersion = await prisma.rubricVersion.findUnique({
      where: { id: rubricVersionId },
      include: {
        rubric: { include: { pathways: { select: { pathwayId: true } } } },
        scaleVersions: true,
      },
    });

    if (!rubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const scales = [...rubricVersion.scaleVersions]
      .filter((scaleVersion) => !isGraveyardSection(scaleVersion.section))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(toScaleVersionPayload);

    res.json({
      id: rubricVersion.rubric.id,
      title: rubricVersion.rubric.title,
      description: rubricVersion.rubric.description,
      active: rubricVersion.rubric.active,
      pathwayIds: toRubricPathwayIds(rubricVersion.rubric.pathways),
      scales,
      versions: [{ id: rubricVersion.id, versionNum: rubricVersion.versionNum }],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubric', details: error });
  }
});

router.post('/responses/save-draft', async (req: Request, res: Response) => {
  try {
    const { responses, userId, pathwayId } = req.body as {
      responses: DraftResponseInput[];
      userId: string;
      pathwayId?: unknown;
    };

    if (!responses || responses.length === 0) {
      return res.status(400).json({ error: 'No responses provided' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resolvedPathwayId = resolvePathwayId(pathwayId);

    await prisma.$transaction(async (tx) => {
      for (const row of responses) {
        await saveScopedResponse(tx, {
          scope: { userId, rubricVersionId: row.rubricVersionId, pathwayId: resolvedPathwayId },
          row,
          status: 'DRAFT',
          justification: normalizeOptionalJustification(row.justification),
        });
      }
    });

    return res.json({ message: 'Draft saved' });
  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
    return res.status(500).json({ error: errorMessage });
  }
});

router.get('/responses', async (req: Request, res: Response) => {
  try {
    const { userId, rubricVersionId, pathwayId } = req.query as {
      userId: string;
      rubricVersionId: string;
      pathwayId?: string;
    };

    if (!userId || !rubricVersionId) {
      return res.status(400).json({ error: 'Missing query params' });
    }

    const responses = await prisma.response.findMany({
      where: buildResponseScope({
        userId,
        rubricVersionId,
        pathwayId: resolvePathwayId(pathwayId),
      }),
    });

    return res.json(responses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

router.post('/responses/submit', async (req: Request, res: Response) => {
  try {
    const { userId, rubricVersionId, responses, pathwayId } = req.body as {
      userId: string;
      rubricVersionId: string;
      responses: DraftResponseInput[];
      pathwayId?: unknown;
    };

    if (!userId || !rubricVersionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const submittedAt = new Date();
    const submittedRows = Array.isArray(responses) ? responses : [];
    const resolvedPathwayId = resolvePathwayId(pathwayId);
    const coveredScaleVersionIds = new Set(submittedRows.map((row) => row.scaleVersionId));

    for (const row of submittedRows) {
      requireJustification(row.justification);
    }
    await assertSavedDraftJustifications({
      userId,
      rubricVersionId,
      pathwayId: resolvedPathwayId,
      coveredScaleVersionIds,
    });

    if (submittedRows.length > 0) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await prisma.$transaction(async (tx) => {
        for (const row of submittedRows) {
          await saveScopedResponse(tx, {
            scope: { userId, rubricVersionId: row.rubricVersionId, pathwayId: resolvedPathwayId },
            row,
            status: 'SUBMITTED',
            justification: requireJustification(row.justification),
            submittedAt,
          });
        }
      });
    }

    const scope = buildResponseScope({ userId, rubricVersionId, pathwayId: resolvedPathwayId });
    const result = await prisma.response.updateMany({
      where: { ...scope, status: 'DRAFT', justification: { not: null } },
      data: { status: 'SUBMITTED', submittedAt },
    });
    await prisma.userRubricAssignment.updateMany({
      where: scope,
      data: { status: 'COMPLETED', completedAt: submittedAt },
    });
    return res.json({
      message: 'Responses submitted',
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === JUSTIFICATION_REQUIRED_ERROR) {
      return res.status(400).json({ error: JUSTIFICATION_REQUIRED_ERROR });
    }
    return res.status(500).json({ error: 'Failed to submit responses' });
  }
});

router.post('/responses/reopen-for-edit', async (req: Request, res: Response) => {
  try {
    const { userId, rubricVersionId, pathwayId } = req.body as {
      userId?: string;
      rubricVersionId?: string;
      pathwayId?: unknown;
    };

    if (!userId || !rubricVersionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const scope = buildResponseScope({
      userId,
      rubricVersionId,
      pathwayId: resolvePathwayId(pathwayId),
    });
    const assignment = await prisma.userRubricAssignment.findFirst({ where: scope });

    if (!assignment || assignment.status !== AssignmentStatus.COMPLETED) {
      return res
        .status(400)
        .json({ error: 'Only a completed rubric assignment can be reopened for editing' });
    }

    const submittedCount = await prisma.response.count({
      where: { ...scope, status: 'SUBMITTED' },
    });

    if (submittedCount === 0) {
      return res.status(400).json({ error: 'No submitted responses found for this rubric' });
    }

    await prisma.$transaction([
      prisma.response.updateMany({
        where: { ...scope, status: 'SUBMITTED' },
        data: { status: 'DRAFT' },
      }),
      prisma.userRubricAssignment.updateMany({
        where: scope,
        data: { status: AssignmentStatus.IN_PROGRESS, completedAt: null },
      }),
    ]);

    return res.json({ message: 'Rubric reopened for editing' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to reopen rubric for editing' });
  }
});

type PathwayContextRow = {
  rubricVersionId: string;
  pathwayId: string;
  pathwayName: string;
  isGeneralPathway: boolean;
};

async function buildLocalLeaderContexts(args: {
  rubricId: string;
  institutionId: string;
  latestRubricVersionId: string;
}): Promise<PathwayContextRow[]> {
  const submissionGroups = await prisma.response.groupBy({
    by: ['pathwayId'],
    where: {
      status: 'SUBMITTED',
      rubricVersion: { is: { rubricId: args.rubricId } },
      user: { is: { institutionId: args.institutionId } },
    },
  });

  const pathways = await prisma.pathway.findMany({
    where: { id: { in: submissionGroups.map((group) => group.pathwayId) } },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true },
  });

  return pathways
    .map((pathway) => ({
      rubricVersionId: args.latestRubricVersionId,
      pathwayId: pathway.id,
      pathwayName: pathway.name,
      isGeneralPathway: isGeneralPathwayId(pathway.id),
    }))
    .sort((left, right) => Number(right.isGeneralPathway) - Number(left.isGeneralPathway));
}

async function buildProjectLeadGroups() {
  const pathways = await prisma.pathway.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true },
  });
  return pathways.map((pathway) => ({
    pathwayId: pathway.id,
    pathwayName: pathway.name,
    isGeneralPathway: isGeneralPathwayId(pathway.id),
  }));
}

router.get('/analytics-context', async (req: Request, res: Response) => {
  const sessionUser = requireLeadOrProjectLeadSession(req, res);
  if (!sessionUser) {
    return;
  }

  const rubricIdRaw = req.query.rubricId;
  const rubricId = typeof rubricIdRaw === 'string' ? rubricIdRaw.trim() : '';

  if (!rubricId) {
    return res.status(400).json({ error: 'Missing rubricId' });
  }

  try {
    const rubricVersions = await prisma.rubricVersion.findMany({
      where: { rubricId },
      select: { id: true, versionNum: true },
      orderBy: { versionNum: 'asc' },
    });
    const latestRubricVersionId = rubricVersions[rubricVersions.length - 1]?.id;

    if (!latestRubricVersionId) {
      return res.json({ mode: sessionUser.role, rubricId, contexts: [], groups: [] });
    }

    if (sessionUser.role === 'LOCAL_LEADER') {
      const contexts = sessionUser.institutionId
        ? await buildLocalLeaderContexts({
            rubricId,
            institutionId: sessionUser.institutionId,
            latestRubricVersionId,
          })
        : [];
      return res.json({ mode: 'LOCAL_LEADER', rubricId, contexts, groups: [] });
    }

    if (sessionUser.role === 'PROJECT_LEAD') {
      return res.json({
        mode: 'PROJECT_LEAD',
        rubricId,
        rubricVersionId: latestRubricVersionId,
        groups: await buildProjectLeadGroups(),
        contexts: [],
      });
    }

    return res.json({ mode: sessionUser.role, rubricId, contexts: [], groups: [] });
  } catch (error) {
    console.error('analytics-context failed', error);
    return res.status(500).json({ error: 'Failed to fetch analytics context' });
  }
});

function toDisplayName(user: { name: string; aliasName: string | null }): string {
  const aliasName = user.aliasName?.trim();
  return aliasName ? aliasName : user.name;
}

router.get('/assignment-matrix', async (req: Request, res: Response) => {
  const sessionUser = requireLeadOrProjectLeadSession(req, res);
  if (!sessionUser) {
    return;
  }

  const institutionIdQuery =
    typeof req.query.institutionId === 'string' ? req.query.institutionId.trim() : '';
  const institutionId =
    sessionUser.role === 'LOCAL_LEADER'
      ? sessionUser.institutionId
      : institutionIdQuery || sessionUser.institutionId;

  if (!institutionId) {
    return res.json({ rubrics: [], users: [], assignments: [] });
  }

  if (
    sessionUser.role === 'LOCAL_LEADER' &&
    sessionUser.institutionId &&
    institutionId !== sessionUser.institutionId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const activeRubrics = await prisma.rubric.findMany({
      where: { active: true },
      select: { id: true, title: true },
    });

    const rubricColumns = activeRubrics
      .map((rubric) => ({
        id: rubric.id,
        title: rubric.title,
        rubricNumber: parseRubricNumberFromTitle(rubric.title),
      }))
      .sort(compareRubricsByNumber);

    const latestVersionIdByRubricId = new Map<string, string>();
    for (const rubric of rubricColumns) {
      const rubricVersionId = await findLatestRubricVersionId(rubric.id);
      if (rubricVersionId) {
        latestVersionIdByRubricId.set(rubric.id, rubricVersionId);
      }
    }

    const latestRubricVersionIds = [...latestVersionIdByRubricId.values()];
    const rubricIdByVersionId = new Map<string, string>();
    for (const [rubricId, rubricVersionId] of latestVersionIdByRubricId.entries()) {
      rubricIdByVersionId.set(rubricVersionId, rubricId);
    }

    const institutionUsers = await prisma.user.findMany({
      where: { institutionId },
      select: { id: true, name: true, email: true, aliasName: true, role: true },
    });

    const hideIdentity = sessionUser.role === 'LOCAL_LEADER';
    const matrixUsers = institutionUsers
      .map((user) => ({
        id: user.id,
        name: hideIdentity ? toDisplayName(user) : user.name,
        email: hideIdentity ? '' : user.email,
        aliasName: user.aliasName,
        role: user.role,
      }))
      .sort((left, right) => left.name.localeCompare(right.name));

    const institutionUserIds = matrixUsers.map((user) => user.id);
    const assignmentRows =
      latestRubricVersionIds.length === 0 || institutionUserIds.length === 0
        ? []
        : await prisma.userRubricAssignment.findMany({
            where: {
              userId: { in: institutionUserIds },
              rubricVersionId: { in: latestRubricVersionIds },
            },
            select: {
              userId: true,
              rubricVersionId: true,
              pathwayId: true,
              status: true,
              pathway: { select: { id: true, name: true } },
            },
          });

    const assignments = assignmentRows.flatMap((row) => {
      const rubricId = rubricIdByVersionId.get(row.rubricVersionId);
      if (!rubricId) {
        return [];
      }
      return [
        {
          userId: row.userId,
          rubricId,
          pathwayId: row.pathwayId,
          pathwayName: row.pathway.name,
          isGeneralPathway: isGeneralPathwayId(row.pathwayId),
          status: row.status,
        },
      ];
    });

    return res.json({
      rubrics: rubricColumns.map(({ id, title, rubricNumber }) => ({
        id,
        title,
        rubricNumber,
      })),
      users: matrixUsers,
      assignments,
    });
  } catch (error) {
    console.error('assignment-matrix failed', error);
    return res.status(500).json({ error: 'Failed to fetch assignment matrix' });
  }
});

/**
 * Registered after static paths (`/responses`, `/response-export`, etc.) so those URLs are not captured here.
 */
router.get('/:rubricId', async (req: Request, res: Response) => {
  try {
    const rubricIdParam = req.params.rubricId;
    if (typeof rubricIdParam !== 'string' || !isRubricIdUuid(rubricIdParam)) {
      return res.status(404).json({ error: 'Rubric not found, invalid rubric ID' });
    }
    const rubricId = rubricIdParam;
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric not found' });
    }

    // Make sure there is always a version to edit/view.
    const rubricVersionId = await ensureRubricVersionForRubric(rubricId);
    const latestRubricVersion = await prisma.rubricVersion.findUnique({
      where: { id: rubricVersionId },
      include: {
        rubric: { include: { pathways: { select: { pathwayId: true } } } },
        scaleVersions: true,
      },
    });

    if (!latestRubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const scales = [...latestRubricVersion.scaleVersions]
      .filter((scaleVersion) => !isGraveyardSection(scaleVersion.section))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(toScaleVersionPayload);

    const graveyardLiveScales = await prisma.scale.findMany({
      where: { rubricId },
      orderBy: { orderIndex: 'asc' },
    });
    const graveyardScales = graveyardLiveScales
      .filter((scale) => isGraveyardSection(scale.section))
      .map((scale) => ({
        ...toScalePayload(scale),
        originalScaleId: scale.id,
        section: fromGraveyardSection(scale.section),
      }));

    res.json({
      id: latestRubricVersion.rubric.id,
      title: latestRubricVersion.rubric.title,
      description: latestRubricVersion.rubric.description,
      active: latestRubricVersion.rubric.active,
      pathwayIds: toRubricPathwayIds(latestRubricVersion.rubric.pathways),
      scales,
      graveyardScales,
      versions: [{ id: latestRubricVersion.id, versionNum: latestRubricVersion.versionNum }],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubric', details: error });
  }
});

export default router;
