import { prisma } from '@lib/prisma';
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

function validateRoleChange(params: {
  sessionUser: SessionUser;
  targetUserId: string;
  existingRole: UserRole;
  newRole: UserRole;
}): { allowed: boolean; error?: string } {
  const { sessionUser, targetUserId, existingRole, newRole } = params;

  if (existingRole === newRole) {
    return { allowed: true };
  }

  if (targetUserId === sessionUser.id) {
    return { allowed: false, error: 'Cannot change your own role' };
  }

  if (existingRole === 'PROJECT_LEAD') {
    return { allowed: false, error: 'Cannot change a project lead role' };
  }

  if (sessionUser.role === 'PROJECT_LEAD') {
    return { allowed: true };
  }

  if (sessionUser.role === 'LOCAL_LEADER') {
    if (newRole === 'PROJECT_LEAD') {
      return { allowed: false, error: 'Local leaders cannot assign the project lead role' };
    }
    return { allowed: true };
  }

  return { allowed: false, error: 'Forbidden' };
}

router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.get('/all', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  try {
    if (sessionUser.role === 'LOCAL_LEADER' && !sessionUser.institutionId) {
      res.json([]);
      return;
    }

    const users = await prisma.user.findMany({
      include: {
        userCourseBins: true,
      },
      orderBy: { name: 'asc' },
      ...(sessionUser.role === 'LOCAL_LEADER' && sessionUser.institutionId
        ? { where: { institutionId: sessionUser.institutionId } }
        : {}),
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

type UserPatchBody = {
  name?: unknown;
  role?: unknown;
  institutionId?: unknown;
  avatarUrl?: unknown;
  courseBinIds?: unknown;
};

router.get('/by-institution/:institutionId', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const institutionId = req.params.institutionId;
  if (!institutionId) {
    res.status(400).json({ error: 'Institution ID is required' });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: { institutionId: institutionId as string },
      include: { userCourseBins: true },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const rawId = req.params.id;
  const targetUserId = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!targetUserId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  const body = req.body as UserPatchBody;

  const name = body.name !== undefined ? body.name : undefined;
  const role = body.role !== undefined ? body.role : undefined;
  const institutionIdInput = body.institutionId !== undefined ? body.institutionId : undefined;
  const avatarUrlInput = body.avatarUrl !== undefined ? body.avatarUrl : undefined;
  const courseBinIdsInput = body.courseBinIds !== undefined ? body.courseBinIds : undefined;

  if (name !== undefined && typeof name !== 'string') {
    res.status(400).json({ error: 'name must be a string' });
    return;
  }
  if (name !== undefined && name.trim() === '') {
    res.status(400).json({ error: 'name must not be empty' });
    return;
  }
  if (role !== undefined && !isUserRole(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }
  if (
    institutionIdInput !== undefined &&
    institutionIdInput !== null &&
    typeof institutionIdInput !== 'string'
  ) {
    res.status(400).json({ error: 'institutionId must be a string or null' });
    return;
  }
  if (
    avatarUrlInput !== undefined &&
    avatarUrlInput !== null &&
    typeof avatarUrlInput !== 'string'
  ) {
    res.status(400).json({ error: 'avatarUrl must be a string or null' });
    return;
  }
  if (
    courseBinIdsInput !== undefined &&
    (!Array.isArray(courseBinIdsInput) || courseBinIdsInput.some((id) => typeof id !== 'string'))
  ) {
    res.status(400).json({ error: 'courseBinIds must be an array of strings' });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { userCourseBins: true },
    });
    if (!existing) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (sessionUser.role === 'LOCAL_LEADER') {
      if (!sessionUser.institutionId || existing.institutionId !== sessionUser.institutionId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      if (institutionIdInput !== undefined && institutionIdInput !== sessionUser.institutionId) {
        res.status(403).json({ error: 'Cannot change institution' });
        return;
      }
    }

    if (isUserRole(role)) {
      const roleChangeCheck = validateRoleChange({
        sessionUser,
        targetUserId,
        existingRole: existing.role,
        newRole: role,
      });
      if (!roleChangeCheck.allowed) {
        res.status(403).json({ error: roleChangeCheck.error });
        return;
      }
    }

    const finalInstitutionId =
      institutionIdInput === undefined
        ? existing.institutionId
        : (institutionIdInput as string | null);

    const courseBinIds =
      courseBinIdsInput !== undefined ? (courseBinIdsInput as string[]) : undefined;

    if (courseBinIds && courseBinIds.length > 0) {
      if (!finalInstitutionId) {
        res.status(400).json({ error: 'Assign an institution before course bins' });
        return;
      }
      const bins = await prisma.courseBin.findMany({
        where: { id: { in: courseBinIds } },
        select: { id: true, institutionId: true },
      });
      if (bins.length !== courseBinIds.length) {
        res.status(400).json({ error: 'Invalid course bin id' });
        return;
      }
      const hasWrongInstitution = bins.some((b) => b.institutionId !== finalInstitutionId);
      if (hasWrongInstitution) {
        res.status(400).json({ error: 'Course bin does not belong to this institution' });
        return;
      }
    }

    const institutionChanged =
      institutionIdInput !== undefined &&
      (finalInstitutionId ?? null) !== (existing.institutionId ?? null);
    const shouldClearBinsForInstitutionChange = institutionChanged && courseBinIds === undefined;

    const updated = await prisma.$transaction(async (tx) => {
      const userUpdate: {
        name?: string;
        role?: UserRole;
        institutionId?: string | null;
        avatarUrl?: string | null;
      } = {};
      if (typeof name === 'string') userUpdate.name = name.trim();
      if (isUserRole(role)) userUpdate.role = role;
      if (institutionIdInput !== undefined) {
        userUpdate.institutionId = finalInstitutionId;
      }
      if (avatarUrlInput !== undefined) {
        userUpdate.avatarUrl = avatarUrlInput === null ? null : (avatarUrlInput as string);
      }

      await tx.user.update({
        where: { id: targetUserId },
        data: userUpdate,
      });

      if (shouldClearBinsForInstitutionChange) {
        await tx.userCourseBin.deleteMany({ where: { userId: targetUserId } });
      } else if (courseBinIds) {
        await tx.userCourseBin.deleteMany({ where: { userId: targetUserId } });
        if (courseBinIds.length > 0) {
          await tx.userCourseBin.createMany({
            data: courseBinIds.map((courseBinId) => ({
              userId: targetUserId,
              courseBinId,
            })),
          });
        }
      }

      return tx.user.findUnique({
        where: { id: targetUserId },
        include: { userCourseBins: true },
      });
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
