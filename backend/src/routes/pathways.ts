import { Router } from 'express';
import type { Request, Response } from 'express';
import { PATHWAYS } from '@shared/pathways';
import { prisma } from '@lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const pathways = await prisma.pathway.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, sortOrder: true },
    });
    if (pathways.length > 0) {
      return res.json(pathways);
    }
    return res.json(PATHWAYS.map((pathway) => ({ ...pathway })));
  } catch {
    return res.json(PATHWAYS.map((pathway) => ({ ...pathway })));
  }
});

export default router;
