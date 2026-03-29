import { prisma } from '@lib/prisma';
import type { Prisma } from '../../generated/prisma/client';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { UserRole } from '@shared/types';

const router = Router();

const USER_ROLES: UserRole[] = ['PROJECT_LEAD', 'LOCAL_LEADER', 'FACULTY', 'USER'];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && USER_ROLES.includes(value as UserRole);
}

type SessionUser = {
  id: string;
  role: UserRole;
  institutionId: string | null;
};

function parseSessionUser(req: Request): SessionUser | null {
  if (!req.user) return null;
  const user = req.user as { id?: string; role?: string; institutionId?: string | null };
  if (!user.id || !isUserRole(user.role)) return null;
  return {
    id: user.id,
    role: user.role,
    institutionId: user.institutionId ?? null,
  };
}

function requireAdminSession(req: Request, res: Response): SessionUser | null {
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

type DeletionDb = Pick<
  Prisma.TransactionClient,
  'courseBin' | 'userCourseBin' | 'response' | 'course'
>;

async function fetchCourseBinDeletionImpact(
  db: DeletionDb,
  courseBinId: string
): Promise<{ assignedUserCount: number; responseCount: number } | null> {
  const courseBin = await db.courseBin.findUnique({
    where: { id: courseBinId },
    select: { id: true, predefinedBinId: true },
  });
  if (!courseBin) {
    return null;
  }

  const assignments = await db.userCourseBin.findMany({
    where: { courseBinId },
    select: { userId: true },
  });
  const assignedUserCount = assignments.length;
  const userIds = [...new Set(assignments.map((row) => row.userId))];

  if (userIds.length === 0) {
    return { assignedUserCount: 0, responseCount: 0 };
  }

  const otherAssignmentsSamePredefined = await db.userCourseBin.findMany({
    where: {
      userId: { in: userIds },
      courseBinId: { not: courseBinId },
      courseBin: { predefinedBinId: courseBin.predefinedBinId },
    },
    select: { userId: true },
  });
  const userIdsRetainingPredefinedAccess = new Set(
    otherAssignmentsSamePredefined.map((row) => row.userId)
  );
  const userIdsForResponseRemoval = userIds.filter(
    (id) => !userIdsRetainingPredefinedAccess.has(id)
  );

  const responseCount =
    userIdsForResponseRemoval.length === 0
      ? 0
      : await db.response.count({
          where: {
            predefinedBinId: courseBin.predefinedBinId,
            userId: { in: userIdsForResponseRemoval },
          },
        });

  return { assignedUserCount, responseCount };
}

function canManageCourseBin(sessionUser: SessionUser, institutionId: string): boolean {
  if (sessionUser.role === 'PROJECT_LEAD') {
    return true;
  }
  return Boolean(sessionUser.institutionId && sessionUser.institutionId === institutionId);
}

function parseCourseBinIdParam(req: Request): string | null {
  const raw = req.params.courseBinId;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || typeof id !== 'string') {
    return null;
  }
  return id;
}

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

router.get('/:courseBinId/deletion-impact', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const courseBinId = parseCourseBinIdParam(req);
  if (!courseBinId) {
    res.status(400).json({ error: 'Invalid course bin id' });
    return;
  }

  try {
    const existing = await prisma.courseBin.findUnique({
      where: { id: courseBinId },
      select: { institutionId: true },
    });

    if (!existing) {
      res.status(404).json({ error: 'Course bin not found' });
      return;
    }

    if (!canManageCourseBin(sessionUser, existing.institutionId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const impact = await fetchCourseBinDeletionImpact(prisma, courseBinId);
    if (!impact) {
      res.status(404).json({ error: 'Course bin not found' });
      return;
    }

    res.json(impact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load deletion impact', details: error });
  }
});

router.delete('/:courseBinId', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const courseBinId = parseCourseBinIdParam(req);
  if (!courseBinId) {
    res.status(400).json({ error: 'Invalid course bin id' });
    return;
  }

  try {
    const existing = await prisma.courseBin.findUnique({
      where: { id: courseBinId },
      select: { id: true, institutionId: true, predefinedBinId: true },
    });

    if (!existing) {
      res.status(404).json({ error: 'Course bin not found' });
      return;
    }

    if (!canManageCourseBin(sessionUser, existing.institutionId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      const assignments = await tx.userCourseBin.findMany({
        where: { courseBinId },
        select: { userId: true },
      });
      const userIds = [...new Set(assignments.map((row) => row.userId))];

      if (userIds.length > 0) {
        const otherAssignmentsSamePredefined = await tx.userCourseBin.findMany({
          where: {
            userId: { in: userIds },
            courseBinId: { not: courseBinId },
            courseBin: { predefinedBinId: existing.predefinedBinId },
          },
          select: { userId: true },
        });
        const userIdsRetainingPredefinedAccess = new Set(
          otherAssignmentsSamePredefined.map((row) => row.userId)
        );
        const userIdsForResponseRemoval = userIds.filter(
          (id) => !userIdsRetainingPredefinedAccess.has(id)
        );

        if (userIdsForResponseRemoval.length > 0) {
          await tx.response.deleteMany({
            where: {
              predefinedBinId: existing.predefinedBinId,
              userId: { in: userIdsForResponseRemoval },
            },
          });
        }
      }

      await tx.userCourseBin.deleteMany({ where: { courseBinId } });
      await tx.course.deleteMany({ where: { courseBinId } });
      await tx.courseBin.delete({ where: { id: courseBinId } });
    });

    res.json({ message: 'Course bin deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course bin', details: error });
  }
});

router.patch('/:courseBinId', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const courseBinId = parseCourseBinIdParam(req);
  if (!courseBinId) {
    res.status(400).json({ error: 'Invalid course bin id' });
    return;
  }

  const displayNameInput = req.body?.displayName;

  if (typeof displayNameInput !== 'string') {
    res.status(400).json({ error: 'displayName must be a string' });
    return;
  }

  const displayName = displayNameInput.trim();
  if (!displayName) {
    res.status(400).json({ error: 'displayName cannot be empty' });
    return;
  }

  try {
    const existing = await prisma.courseBin.findUnique({
      where: { id: courseBinId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Course bin not found' });
      return;
    }

    if (!canManageCourseBin(sessionUser, existing.institutionId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updated = await prisma.courseBin.update({
      where: { id: courseBinId },
      data: { displayName },
    });

    res.json({ message: 'Course bin updated', courseBin: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course bin', details: error });
  }
});

export default router;
