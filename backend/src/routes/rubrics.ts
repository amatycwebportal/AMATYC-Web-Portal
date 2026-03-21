import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

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


router.post('/assign', async (req: Request, res: Response) => {
  try {
    const { rubricId, userId } = req.body;
    const rubric = await prisma.rubric.findUnique({ where: { id: rubricId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!rubric || !user) {
      return res.status(404).json({ error: 'Rubric or user not found' });
    }
    await prisma.rubric.update({ where: { id: rubricId }, data: { assignedUsers: { connect: { id: userId } } } });
    res.json({ message: 'Rubric assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign rubric' });
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
    await prisma.rubric.update({ where: { id: rubricId }, data: { assignedUsers: { disconnect: { id: userId } } } });
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
    await prisma.rubric.update({ where: { id: rubricId }, data: { inProgressUsers: { connect: { id: userId } } } });
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
    await prisma.rubric.update({ where: { id: rubricId }, data: { completedUsers: { connect: { id: userId } } } });
    res.json({ message: 'Rubric completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete rubric' });
  }
});
export default router;
