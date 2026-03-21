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
export default router;  
