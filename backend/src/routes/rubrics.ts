import { AssignmentStatus, prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

async function findLatestRubricVersionId(rubricId: string): Promise<string | null> {
  const rubricVersion = await prisma.rubricVersion.findFirst({
    where: { rubricId },
    orderBy: { versionNum: 'desc' },
    select: { id: true },
  });
  return rubricVersion?.id ?? null;
}

/** Ensures at least one RubricVersion exists; creates v1 + ScaleVersions from current scales if needed. */
async function ensureRubricVersionForRubric(rubricId: string): Promise<string> {
  const existingId = await findLatestRubricVersionId(rubricId);
  if (existingId) return existingId;

  const rubric = await prisma.rubric.findUnique({
    where: { id: rubricId },
    include: { scales: { orderBy: { orderIndex: 'asc' } } },
  });
  if (!rubric) {
    throw new Error('Rubric not found');
  }

  const rubricVersion = await prisma.$transaction(async (transaction) => {
    const newRubricVersion = await transaction.rubricVersion.create({
      data: {
        rubricId,
        versionNum: 1,
        changelog: 'Initial version',
      },
    });
    for (const scale of rubric.scales) {
      await transaction.scaleVersion.create({
        data: {
          rubricVersionId: newRubricVersion.id,
          originalScaleId: scale.id,
          prompt: scale.prompt,
          orderIndex: scale.orderIndex,
          isGlobal: scale.isGlobal,
          editable: scale.editable,
          ...(scale.levelDescriptions != null
            ? { levelDescriptions: scale.levelDescriptions }
            : {}),
          ...(scale.section != null ? { section: scale.section } : {}),
        },
      });
    }
    return newRubricVersion;
  });
  return rubricVersion.id;
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
        versions: {
          orderBy: { versionNum: 'desc' },
          take: 1, // only latest version
          include: {
            scaleVersions: true,
          },
        },
      },
    });

    const formattedRubrics = rubrics.map((rubric) => {
      const latestVersion = rubric.versions[0];
      const scaleVersions = latestVersion?.scaleVersions ?? [];

      const scales =
        scaleVersions.length > 0
          ? [...scaleVersions]
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((scaleVersion) => ({
                id: scaleVersion.id,
                prompt: scaleVersion.prompt,
                section: scaleVersion.section,
                orderIndex: scaleVersion.orderIndex,
                editable: scaleVersion.editable,
                isGlobal: scaleVersion.isGlobal,
                levelDescriptions: scaleVersion.levelDescriptions as any,
              }))
          : [...rubric.scales]
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((scale) => ({
                id: scale.id,
                prompt: scale.prompt,
                section: scale.section,
                orderIndex: scale.orderIndex,
                editable: scale.editable,
                isGlobal: scale.isGlobal,
                levelDescriptions: scale.levelDescriptions as any,
              }));

      return {
        id: rubric.id,
        title: rubric.title,
        description: rubric.description,
        active: rubric.active,
        scales,
        versions: latestVersion
          ? [{ id: latestVersion.id, versionNum: latestVersion.versionNum }]
          : [],
      };
    });

    res.json(formattedRubrics.sort((a, b) => a.title.localeCompare(b.title)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rubrics' });
  }
});

router.get('/assigned/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const rubrics = await prisma.rubricVersion.findMany({
      where: {
        assignments: { some: { userId: userId as string, status: AssignmentStatus.ASSIGNED } },
      },
    });
    res.json(rubrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assigned rubrics' });
  }
});

router.post('/assign', async (req: Request, res: Response) => {
  try {
    const { rubricId, userIds } = req.body;
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
    if (!rubric || users.length === 0) {
      return res.status(406).json({ error: 'Rubric or users not found' });
    }
    const rubricVersionId = await ensureRubricVersionForRubric(rubric.id);
    await prisma.userRubricAssignment.createMany({
      data: users.map((user) => ({
        userId: user.id,
        rubricVersionId,
        status: AssignmentStatus.ASSIGNED,
      })),
    });
    res.json({ message: 'Rubrics assigned successfully' });
  } catch (error) {
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
      data: { status: AssignmentStatus.IN_PROGRESS },
    });
    res.json({ message: 'Rubric started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start rubric' });
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
    const { scales, id, versions, ...rubricFields } = updatedRubric;

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

      // 2. Write scale edits back to live Scale + ScaleBin rows
      for (const scale of scales) {
        await tx.scale.update({
          where: { id: scale.originalScaleId },
          data: {
            prompt: scale.prompt,
            orderIndex: scale.orderIndex,
            isGlobal: scale.isGlobal,
            editable: scale.editable,
            section: scale.section,
            levelDescriptions: scale.levelDescriptions,
          },
        });

        await tx.scaleBin.deleteMany({ where: { scaleId: scale.originalScaleId } });
        await tx.scaleBin.createMany({
          data: scale.binIds.map((binId: string) => ({
            scaleId: scale.originalScaleId,
            predefinedBinId: binId,
          })),
        });
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
        if (liveScale.levelDescriptions === null) {
          return res.status(400).json({ error: 'Level descriptions are required' });
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
    console.error('Failed to update rubric', error);
    res.status(500).json({ error: 'Failed to update rubric' });
  }
});

router.get('/:rubricId', async (req: Request, res: Response) => {
  try {
    const { rubricId } = req.params;
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId as string } });
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric not found' });
    }

    // Make sure there is always a version to edit/view.
    const rubricVersionId = await ensureRubricVersionForRubric(rubricId as string);
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

export default router;
