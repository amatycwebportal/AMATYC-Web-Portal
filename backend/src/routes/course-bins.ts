import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    const courseBins = await prisma.courseBin.findMany({
      orderBy: { displayName: 'asc' },
    });
    res.json(courseBins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course bins', details: error });
  }
});

router.post('/create', async (req: Request, res: Response) => {
  try {
    const { name, institutionId, predefinedCourseBinId } = req.body;
    const courseBin = await prisma.courseBin.create({
      data: {
        displayName: name,
        institutionId: institutionId,
        predefinedBinId: predefinedCourseBinId,
      },
    });
    res.json(courseBin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course bin', details: error });
  }
});

router.get('/institution/:institutionId', async (req: Request, res: Response) => {
  try {
    const { institutionId } = req.params;
    const courseBins = await prisma.courseBin.findMany({
      where: { institutionId: institutionId as string },
    });
    res.json(courseBins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course bins', details: error });
  }
});
export default router;
