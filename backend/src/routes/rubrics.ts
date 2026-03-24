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
        scales: true,
      },
    });
    res.json(rubrics);
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
export default router;
