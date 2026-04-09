import {
  buildResponseExportWhere,
  fetchResponseExportRows,
  getResponseExportCsvHeader,
  RESPONSE_EXPORT_ALL_SCALES,
  RESPONSE_EXPORT_ALL_SECTIONS,
  responseExportRowsToCsvStrings,
} from '@lib/buildResponseExport';
import { encodeCsvDocument } from '@lib/csvEncoding';
import { ensureRubricVersionForRubric, findLatestRubricVersionId } from '@lib/rubricVersion';
import { AssignmentStatus, prisma } from '@lib/prisma';
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
  predefinedBinId?: string | null;
  score: number;
  justification?: string | null;
};

function normalizeOptionalJustification(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isScaleVisibleToUser(
  scaleVersion: {
    isGlobal: boolean;
    scaleVersionBins: { predefinedBinId: string }[];
  },
  userPredefinedBinIds: Set<string>
): boolean {
  if (scaleVersion.isGlobal) return true;
  return scaleVersion.scaleVersionBins.some((bin) => userPredefinedBinIds.has(bin.predefinedBinId));
}

function normalizePredefinedBinId(predefinedBinId?: string | null): string | null {
  if (!predefinedBinId) return null;
  return predefinedBinId;
}

const RUBRIC_ID_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GRAVEYARD_SECTION_PREFIX = '__GRAVEYARD__::';

function isRubricIdUuid(value: string): boolean {
  return true; //RUBRIC_ID_UUID_PATTERN.test(value);
}

function isGraveyardSection(section: string | null): boolean {
  return typeof section === 'string' && section.startsWith(GRAVEYARD_SECTION_PREFIX);
}

function toGraveyardSection(section: string | null | undefined): string {
  const normalizedSection = (section ?? 'General').trim();
  return `${GRAVEYARD_SECTION_PREFIX}${normalizedSection.length > 0 ? normalizedSection : 'General'}`;
}

function fromGraveyardSection(section: string | null): string | null {
  if (!isGraveyardSection(section)) {
    return section;
  }
  const graveyardSection = section as string;
  const parsedSection = graveyardSection.slice(GRAVEYARD_SECTION_PREFIX.length).trim();
  if (parsedSection.length === 0) {
    return 'General';
  }
  return parsedSection;
}

router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    const rubrics = await prisma.rubric.findMany({
      include: {
        // Used only as a fallback if a rubric has no versions yet.
        scales: {
          include: {
            scaleBins: true,
          },
        },
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
      {
        id: string;
        prompt: string;
        section: string | null;
        orderIndex: number;
        editable: boolean;
        isGlobal: boolean;
        levelDescriptions: unknown;
        scaleVersionBins: { predefinedBinId: string }[];
      }[]
    >();

    if (latestRubricVersionIds.length > 0) {
      const latestScaleVersions = await prisma.scaleVersion.findMany({
        where: { rubricVersionId: { in: latestRubricVersionIds } },
        include: { scaleVersionBins: true },
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

      const scales =
        scaleVersions.length > 0
          ? scaleVersions
              .filter((scaleVersion) => !isGraveyardSection(scaleVersion.section))
              .map((scaleVersion) => ({
                id: scaleVersion.id,
                prompt: scaleVersion.prompt,
                section: scaleVersion.section,
                orderIndex: scaleVersion.orderIndex,
                editable: scaleVersion.editable,
                isGlobal: scaleVersion.isGlobal,
                levelDescriptions: scaleVersion.levelDescriptions as any,
                binIds: scaleVersion.scaleVersionBins.map((b) => b.predefinedBinId),
              }))
          : [...rubric.scales]
              .filter((scale) => !isGraveyardSection(scale.section))
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((scale) => ({
                id: scale.id,
                prompt: scale.prompt,
                section: scale.section,
                orderIndex: scale.orderIndex,
                editable: scale.editable,
                isGlobal: scale.isGlobal,
                levelDescriptions: scale.levelDescriptions as any,
                binIds: scale.scaleBins.map((b) => b.predefinedBinId),
              }));

      return {
        id: rubric.id,
        title: rubric.title,
        description: rubric.description,
        active: rubric.active,
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
 * Submitted responses only, merged with rubric/scale/user/institution/course-bin context.
 * Query: rubricId (required), sectionKey, scaleId (scale version id from latest template, or __all_scales__),
 * rubricVersionIds (optional comma-separated rubric version row UUIDs; omit for all versions), format=csv|json
 */
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
    if (format === 'json') {
      return res.json([]);
    }
    const emptyCsv = encodeCsvDocument(getResponseExportCsvHeader(), []);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="responses-empty.csv"');
    return res.send(emptyCsv);
  }

  const institutionIdScope = sessionUser.role === 'LOCAL_LEADER' ? sessionUser.institutionId : null;

  const rubricVersionIds = parseRubricVersionIdsFromQuery(req.query.rubricVersionIds);

  try {
    const built = await buildResponseExportWhere({
      rubricId,
      sectionKey,
      scaleVersionId,
      institutionIdScope,
      ...(rubricVersionIds !== undefined ? { rubricVersionIds } : {}),
    });

    if ('error' in built) {
      return res.status(400).json({ error: built.error });
    }

    const rows = await fetchResponseExportRows(built.where);
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

router.get('/assigned/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        userCourseBins: {
          include: {
            courseBin: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userPredefinedBinIds = new Set(
      user.userCourseBins.map((entry) => entry.courseBin.predefinedBinId)
    );
    const rubrics = await prisma.rubricVersion.findMany({
      where: {
        assignments: { some: { userId: userId as string, status: AssignmentStatus.ASSIGNED } },
      },
    });
    const latestRubricVersions = await prisma.rubricVersion.findMany({
      where: { id: { in: rubrics.map((rubric) => rubric.id) } },
      orderBy: { versionNum: 'desc' },
      include: {
        rubric: true,
        scaleVersions: {
          include: {
            scaleVersionBins: true,
          },
        },
      },
    });
    const visibleRubrics = latestRubricVersions.map((rubricVersion) => ({
      ...rubricVersion,
      scaleVersions: rubricVersion.scaleVersions.filter((scaleVersion) =>
        isScaleVisibleToUser(scaleVersion, userPredefinedBinIds)
      ),
    }));
    res.json(visibleRubrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assigned rubrics' });
  }
});

router.get('/inprogress/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        userCourseBins: {
          include: {
            courseBin: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userPredefinedBinIds = new Set(
      user.userCourseBins.map((entry) => entry.courseBin.predefinedBinId)
    );
    const rubrics = await prisma.rubricVersion.findMany({
      where: {
        assignments: { some: { userId: userId as string, status: AssignmentStatus.IN_PROGRESS } },
      },
    });
    const latestRubricVersions = await prisma.rubricVersion.findMany({
      where: { id: { in: rubrics.map((rubric) => rubric.id) } },
      orderBy: { versionNum: 'desc' },
      include: {
        rubric: true,
        scaleVersions: {
          include: {
            scaleVersionBins: true,
          },
        },
      },
    });
    const visibleRubrics = latestRubricVersions.map((rubricVersion) => ({
      ...rubricVersion,
      scaleVersions: rubricVersion.scaleVersions.filter((scaleVersion) =>
        isScaleVisibleToUser(scaleVersion, userPredefinedBinIds)
      ),
    }));
    res.json(visibleRubrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assigned rubrics' });
  }
});

router.get('/completed/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId as string } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const rubrics = await prisma.rubricVersion.findMany({
      where: {
        assignments: { some: { userId: userId as string, status: AssignmentStatus.COMPLETED } },
      },
    });
    const latestRubricVersions = await prisma.rubricVersion.findMany({
      where: { id: { in: rubrics.map((rubric) => rubric.id) } },
      orderBy: { versionNum: 'desc' },
      include: {
        rubric: true,
        scaleVersions: {
          include: {
            scaleVersionBins: true,
          },
        },
      },
    });
    res.json(latestRubricVersions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch completed rubrics' });
  }
});
router.post('/assign', async (req: Request, res: Response) => {
  try {
    const {
      rubricId,
      rubricIds: rubricIdsBody,
      userIds,
    } = req.body as {
      rubricId?: unknown;
      rubricIds?: unknown;
      userIds?: unknown;
    };

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }
    const normalizedUserIds = userIds.filter((id): id is string => typeof id === 'string');
    if (normalizedUserIds.length === 0) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }

    let rubricIds: string[];
    if (Array.isArray(rubricIdsBody) && rubricIdsBody.length > 0) {
      rubricIds = [
        ...new Set(
          rubricIdsBody.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
        ),
      ];
      if (rubricIds.length === 0) {
        return res
          .status(400)
          .json({ error: 'rubricIds must contain at least one valid rubric id' });
      }
    } else if (typeof rubricId === 'string' && rubricId.length > 0) {
      rubricIds = [rubricId];
    } else {
      return res.status(400).json({ error: 'rubricId or non-empty rubricIds is required' });
    }

    const rubricsFound = await prisma.rubric.findMany({ where: { id: { in: rubricIds } } });
    if (rubricsFound.length !== rubricIds.length) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }

    const users = await prisma.user.findMany({ where: { id: { in: normalizedUserIds } } });
    if (users.length === 0) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }

    const userAssignments: Array<{
      userId: string;
      rubricVersionId: string;
      status: AssignmentStatus;
    }> = [];

    for (const rubric of rubricsFound) {
      const rubricVersionId = await ensureRubricVersionForRubric(rubric.id);
      if (!rubricVersionId) {
        return res.status(404).json({ error: 'Rubric version not found' });
      }
      for (const user of users) {
        const userAssignment = await prisma.userRubricAssignment.findUnique({
          where: { userId_rubricVersionId: { userId: user.id, rubricVersionId } },
        });
        if (!userAssignment) {
          userAssignments.push({
            userId: user.id,
            rubricVersionId,
            status: AssignmentStatus.ASSIGNED,
          });
        }
      }
    }

    if (userAssignments.length > 0) {
      await prisma.userRubricAssignment.createMany({
        data: userAssignments,
      });
    }
    res.json({ message: 'Rubrics assigned successfully' });
  } catch (error) {
    console.error('Failed to assign rubrics', error);
    res.status(500).json({ error: 'Failed to assign rubrics', details: error });
  }
});

router.post('/unassign', async (req: Request, res: Response) => {
  try {
    const { rubricId, userId } = req.body;
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!rubric || !user) {
      return res.status(404).json({ error: 'Rubric or user not found' });
    }
    const rubricVersionId = await findLatestRubricVersionId(rubricId);
    if (!rubricVersionId) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }
    await prisma.userRubricAssignment.deleteMany({
      where: { userId: userId, rubricVersionId },
    });
    res.json({ message: 'Rubric unassigned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unassign rubric' });
  }
});

router.post('/start', async (req: Request, res: Response) => {
  try {
    const { rubricVersionId, userId } = req.body;
    const rubric = await prisma.rubricVersion.findUnique({ where: { id: rubricVersionId } });
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await prisma.userRubricAssignment.update({
      where: {
        userId_rubricVersionId: { userId: userId, rubricVersionId },
      },
      data: { status: AssignmentStatus.IN_PROGRESS, startedAt: new Date() },
    });
    res.json({ message: 'Rubric started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start rubric', details: JSON.stringify(error) });
  }
});

router.post('/complete', async (req: Request, res: Response) => {
  try {
    const { rubricId, userId } = req.body;
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!rubric || !user) {
      return res.status(404).json({ error: 'Rubric or user not found' });
    }
    const rubricVersionId = await findLatestRubricVersionId(rubricId);
    if (!rubricVersionId) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }
    await prisma.userRubricAssignment.update({
      where: {
        userId_rubricVersionId: { userId: userId, rubricVersionId },
      },
      data: { status: AssignmentStatus.COMPLETED },
    });
    res.json({ message: 'Rubric completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete rubric' });
  }
});

router.post('/update/:rubricId', async (req: Request, res: Response) => {
  try {
    const { rubricId } = req.params as { rubricId: string };
    const { updatedRubric, changelog } = req.body;

    if (!updatedRubric) {
      return res.status(400).json({ error: 'updatedRubric is required', received: req.body });
    }
    const { scales, graveyardScales, id, versions, ...rubricFields } = updatedRubric;
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

    await prisma.$transaction(async (tx) => {
      // 1. Update rubric metadata
      await tx.rubric.update({
        where: { id: rubricId },
        data: rubricFields,
      });

      // 2. Sync incoming scales to live Scale + ScaleBin rows
      const liveScalesBeforeSync = await tx.scale.findMany({
        where: { rubricId },
        select: { id: true, section: true },
      });
      const incomingScales = [
        ...(
          scales as Array<{
            originalScaleId?: string;
            prompt: string;
            orderIndex: number;
            isGlobal: boolean;
            editable: boolean;
            section?: string | null;
            levelDescriptions?: unknown;
            binIds?: string[];
          }>
        ).map((scale) => ({ ...scale, isGraveyard: false })),
        ...(
          (graveyardScales ?? []) as Array<{
            originalScaleId?: string;
            prompt: string;
            orderIndex: number;
            isGlobal: boolean;
            editable: boolean;
            section?: string | null;
            levelDescriptions?: unknown;
            binIds?: string[];
          }>
        ).map((scale) => ({ ...scale, isGraveyard: true })),
      ];

      const liveScaleIds = new Set(liveScalesBeforeSync.map((scale) => scale.id));
      const liveScaleById = new Map(liveScalesBeforeSync.map((scale) => [scale.id, scale]));
      const keptLiveScaleIds = new Set<string>();

      for (const scale of incomingScales as Array<{
        originalScaleId?: string;
        prompt: string;
        orderIndex: number;
        isGlobal: boolean;
        editable: boolean;
        section?: string | null;
        levelDescriptions?: unknown;
        binIds?: string[];
        isGraveyard: boolean;
      }>) {
        const uniqueBinIds = Array.from(new Set(scale.binIds ?? []));
        const normalizedSection = scale.isGraveyard
          ? toGraveyardSection(scale.section)
          : (scale.section ?? null);
        if (!scale.isGlobal && (!scale.binIds || scale.binIds.length === 0)) {
          throw new Error('Non-global scales must include at least one predefined bin');
        }
        if (scale.originalScaleId && liveScaleIds.has(scale.originalScaleId)) {
          keptLiveScaleIds.add(scale.originalScaleId);
          await tx.scale.update({
            where: { id: scale.originalScaleId },
            data: {
              prompt: scale.prompt,
              orderIndex: scale.orderIndex,
              isGlobal: scale.isGlobal,
              editable: scale.editable,
              section: normalizedSection,
              levelDescriptions: scale.levelDescriptions as any,
            },
          });

          await tx.scaleBin.deleteMany({ where: { scaleId: scale.originalScaleId } });
          if (uniqueBinIds.length > 0) {
            await tx.scaleBin.createMany({
              data: uniqueBinIds.map((binId: string) => ({
                scaleId: scale.originalScaleId as string,
                predefinedBinId: binId,
              })),
            });
          }
          continue;
        }

        const createdScale = await tx.scale.create({
          data: {
            rubricId,
            prompt: scale.prompt,
            orderIndex: scale.orderIndex,
            isGlobal: scale.isGlobal,
            editable: scale.editable,
            section: normalizedSection,
            levelDescriptions: scale.levelDescriptions as any,
          },
          select: { id: true },
        });
        keptLiveScaleIds.add(createdScale.id);
        if (uniqueBinIds.length > 0) {
          await tx.scaleBin.createMany({
            data: uniqueBinIds.map((binId: string) => ({
              scaleId: createdScale.id,
              predefinedBinId: binId,
            })),
          });
        }
      }

      const removedScaleIds = [...liveScaleIds].filter(
        (liveScaleId) => !keptLiveScaleIds.has(liveScaleId)
      );
      if (removedScaleIds.length > 0) {
        for (const removedScaleId of removedScaleIds) {
          const removedScale = liveScaleById.get(removedScaleId);
          await tx.scale.update({
            where: { id: removedScaleId },
            data: { section: toGraveyardSection(removedScale?.section ?? null) },
          });
        }
      }

      // 3. Create the new RubricVersion
      const newVersion = await tx.rubricVersion.create({
        data: {
          rubricId,
          versionNum: latest.versionNum + 1,
          changelog,
        },
      });

      // 4. Snapshot all live scales into ScaleVersion + ScaleVersionBin
      const liveScales = await tx.scale.findMany({
        where: { rubricId },
        include: { scaleBins: true },
      });

      for (const liveScale of liveScales) {
        if (isGraveyardSection(liveScale.section)) {
          continue;
        }
        if (liveScale.levelDescriptions === null) {
          throw new Error('Level descriptions are required');
        }
        const scaleVersion = await tx.scaleVersion.create({
          data: {
            rubricVersionId: newVersion.id,
            originalScaleId: liveScale.id,
            prompt: liveScale.prompt,
            orderIndex: liveScale.orderIndex,
            isGlobal: liveScale.isGlobal,
            editable: liveScale.editable,
            section: liveScale.section,
            levelDescriptions: liveScale.levelDescriptions,
          },
        });

        await tx.scaleVersionBin.createMany({
          data: liveScale.scaleBins.map((sb) => ({
            scaleVersionId: scaleVersion.id,
            predefinedBinId: sb.predefinedBinId,
          })),
        });
      }

      // 5. Migrate ASSIGNED users to the new version
      await tx.userRubricAssignment.updateMany({
        where: {
          rubricVersionId: latest.id,
          status: 'ASSIGNED',
        },
        data: { rubricVersionId: newVersion.id },
      });
    });

    res.json({ message: 'Rubric updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'Non-global scales must include at least one predefined bin') {
      return res.status(400).json({ error: message });
    }
    if (message === 'Level descriptions are required') {
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
    const latestRubricVersion = await prisma.rubricVersion.findUnique({
      where: { id: rubricVersionId },
      include: {
        rubric: true,
        scaleVersions: {
          include: {
            scaleVersionBins: true,
          },
        },
      },
    });

    if (!latestRubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const scales = [...latestRubricVersion.scaleVersions]
      .filter((scaleVersion) => !isGraveyardSection(scaleVersion.section))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((scaleVersion) => ({
        id: scaleVersion.id,
        originalScaleId: scaleVersion.originalScaleId, // needed for writes
        prompt: scaleVersion.prompt,
        section: scaleVersion.section,
        orderIndex: scaleVersion.orderIndex,
        editable: scaleVersion.editable,
        isGlobal: scaleVersion.isGlobal,
        levelDescriptions: scaleVersion.levelDescriptions as any,
        binIds: scaleVersion.scaleVersionBins.map((b) => b.predefinedBinId), // needed for ScaleBin sync
      }));

    res.json({
      id: latestRubricVersion.rubric.id,
      title: latestRubricVersion.rubric.title,
      description: latestRubricVersion.rubric.description,
      active: latestRubricVersion.rubric.active,
      scales,
      versions: [{ id: latestRubricVersion.id, versionNum: latestRubricVersion.versionNum }],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubric', details: error });
  }
});

router.post('/responses/save-draft', async (req: Request, res: Response) => {
  try {
    const { responses, userId } = req.body as {
      responses: DraftResponseInput[];
      userId: string;
    };

    if (!responses || responses.length === 0) {
      return res.status(400).json({ error: 'No responses provided' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userCourseBins: {
          include: {
            courseBin: true,
          },
        },
      },
    });

    if (!user) {
      console.log('user not found');
      return res.status(404).json({ error: 'User not found' });
    }
    const userPredefinedBinIds = user.userCourseBins
      ? new Set(user.userCourseBins.map((entry) => entry.courseBin.predefinedBinId))
      : new Set([]);

    await prisma.$transaction(async (tx) => {
      for (const responseRow of responses) {
        const scaleVersion = await tx.scaleVersion.findUnique({
          where: { id: responseRow.scaleVersionId },
          include: { scaleVersionBins: true },
        });
        if (!scaleVersion || scaleVersion.rubricVersionId !== responseRow.rubricVersionId) {
          throw new Error('Invalid scale version for rubric version');
        }

        let normalizedPredefinedBinId = normalizePredefinedBinId(responseRow.predefinedBinId);
        if (scaleVersion.isGlobal) {
          normalizedPredefinedBinId = null;
        } else {
          if (!normalizedPredefinedBinId) {
            throw new Error('predefinedBinId is required for non-global scales');
          }
          const hasMatchingScaleBin = scaleVersion.scaleVersionBins.some(
            (bin) => bin.predefinedBinId === normalizedPredefinedBinId
          );
          if (!hasMatchingScaleBin) {
            throw new Error('Provided predefined bin is not allowed for this scale');
          }
          if (!userPredefinedBinIds.has(normalizedPredefinedBinId)) {
            throw new Error('User does not have access to this predefined bin');
          }
        }

        const existingDraft = await tx.response.findFirst({
          where: {
            userId,
            scaleVersionId: responseRow.scaleVersionId,
            rubricVersionId: responseRow.rubricVersionId,
            predefinedBinId: normalizedPredefinedBinId as any,
          } as any,
        });

        const justification = normalizeOptionalJustification(responseRow.justification);

        if (existingDraft) {
          await tx.response.update({
            where: { id: existingDraft.id },
            data: {
              score: responseRow.score,
              status: 'DRAFT',
              justification,
            } as any,
          });
          continue;
        }

        await tx.response.create({
          data: {
            userId,
            rubricVersionId: responseRow.rubricVersionId,
            scaleVersionId: responseRow.scaleVersionId,
            predefinedBinId: normalizedPredefinedBinId as any,
            score: responseRow.score,
            status: 'DRAFT',
            justification,
          } as any,
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
    const { userId, rubricVersionId, predefinedBinId } = req.query as {
      userId: string;
      rubricVersionId: string;
      predefinedBinId?: string;
    };

    if (!userId || !rubricVersionId) {
      return res.status(400).json({ error: 'Missing query params' });
    }
    const normalizedPredefinedBinId = normalizePredefinedBinId(predefinedBinId);

    const responses = await prisma.response.findMany({
      where: {
        userId,
        rubricVersionId,
      } as any,
    });

    return res.json(responses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

router.post('/responses/submit', async (req: Request, res: Response) => {
  try {
    const { userId, rubricVersionId, responses } = req.body as {
      userId: string;
      rubricVersionId: string;
      responses: DraftResponseInput[];
    };

    if (!userId || !rubricVersionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const submittedAt = new Date();
    const submittedRows = Array.isArray(responses) ? responses : [];

    if (submittedRows.length > 0) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userCourseBins: {
            include: {
              courseBin: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userPredefinedBinIds = user.userCourseBins
        ? new Set(user.userCourseBins.map((entry) => entry.courseBin.predefinedBinId))
        : new Set<string>();

      await prisma.$transaction(async (tx) => {
        for (const responseRow of submittedRows) {
          const scaleVersion = await tx.scaleVersion.findUnique({
            where: { id: responseRow.scaleVersionId },
            include: { scaleVersionBins: true },
          });
          if (!scaleVersion || scaleVersion.rubricVersionId !== responseRow.rubricVersionId) {
            throw new Error('Invalid scale version for rubric version');
          }

          let normalizedPredefinedBinId = normalizePredefinedBinId(responseRow.predefinedBinId);
          if (scaleVersion.isGlobal) {
            normalizedPredefinedBinId = null;
          } else {
            if (!normalizedPredefinedBinId) {
              throw new Error('predefinedBinId is required for non-global scales');
            }
            const hasMatchingScaleBin = scaleVersion.scaleVersionBins.some(
              (bin) => bin.predefinedBinId === normalizedPredefinedBinId
            );
            if (!hasMatchingScaleBin) {
              throw new Error('Provided predefined bin is not allowed for this scale');
            }
            if (!userPredefinedBinIds.has(normalizedPredefinedBinId)) {
              throw new Error('User does not have access to this predefined bin');
            }
          }

          const existingRow = await tx.response.findFirst({
            where: {
              userId,
              scaleVersionId: responseRow.scaleVersionId,
              rubricVersionId: responseRow.rubricVersionId,
              predefinedBinId: normalizedPredefinedBinId as any,
            } as any,
          });

          const justification = normalizeOptionalJustification(responseRow.justification);

          if (existingRow) {
            await tx.response.update({
              where: { id: existingRow.id },
              data: {
                score: responseRow.score,
                status: 'SUBMITTED',
                submittedAt,
                justification,
              } as any,
            });
            continue;
          }

          await tx.response.create({
            data: {
              userId,
              rubricVersionId: responseRow.rubricVersionId,
              scaleVersionId: responseRow.scaleVersionId,
              predefinedBinId: normalizedPredefinedBinId as any,
              score: responseRow.score,
              status: 'SUBMITTED',
              submittedAt,
              justification,
            } as any,
          });
        }
      });
    }

    const result = await prisma.response.updateMany({
      where: {
        userId,
        rubricVersionId,
        status: 'DRAFT',
      } as any,
      data: {
        status: 'SUBMITTED',
        submittedAt,
      },
    });
    await prisma.userRubricAssignment.updateMany({
      where: {
        userId,
        rubricVersionId,
      },
      data: {
        status: 'COMPLETED',
        completedAt: submittedAt,
      },
    });
    return res.json({
      message: 'Responses submitted',
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to submit responses' });
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
        rubric: true,
        scaleVersions: {
          include: {
            scaleVersionBins: true,
          },
        },
      },
    });

    if (!latestRubricVersion) {
      return res.status(404).json({ error: 'Rubric version not found' });
    }

    const scales = [...latestRubricVersion.scaleVersions]
      .filter((scaleVersion) => !isGraveyardSection(scaleVersion.section))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((scaleVersion) => ({
        id: scaleVersion.id,
        originalScaleId: scaleVersion.originalScaleId, // needed for writes
        prompt: scaleVersion.prompt,
        section: scaleVersion.section,
        orderIndex: scaleVersion.orderIndex,
        editable: scaleVersion.editable,
        isGlobal: scaleVersion.isGlobal,
        levelDescriptions: scaleVersion.levelDescriptions as any,
        binIds: scaleVersion.scaleVersionBins.map((b) => b.predefinedBinId), // needed for ScaleBin sync
      }));
    const graveyardLiveScales = await prisma.scale.findMany({
      where: { rubricId },
      include: { scaleBins: true },
      orderBy: { orderIndex: 'asc' },
    });
    const graveyardScales = graveyardLiveScales
      .filter((scale) => isGraveyardSection(scale.section))
      .map((scale) => ({
        id: scale.id,
        originalScaleId: scale.id,
        prompt: scale.prompt,
        section: fromGraveyardSection(scale.section),
        orderIndex: scale.orderIndex,
        editable: scale.editable,
        isGlobal: scale.isGlobal,
        levelDescriptions: scale.levelDescriptions as any,
        binIds: scale.scaleBins.map((b) => b.predefinedBinId),
      }));

    res.json({
      id: latestRubricVersion.rubric.id,
      title: latestRubricVersion.rubric.title,
      description: latestRubricVersion.rubric.description,
      active: latestRubricVersion.rubric.active,
      scales,
      graveyardScales,
      versions: [{ id: latestRubricVersion.id, versionNum: latestRubricVersion.versionNum }],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubric', details: error });
  }
});

export default router;
