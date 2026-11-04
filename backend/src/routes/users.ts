import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { USER_ROLES, type UserRole } from '@shared/types';

const router = Router();

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
    return { allowed: false, error: 'Cannot change an Administrator role' };
  }

  if (sessionUser.role === 'PROJECT_LEAD') {
    return { allowed: true };
  }

  if (sessionUser.role === 'LOCAL_LEADER') {
    if (newRole === 'PROJECT_LEAD') {
      return { allowed: false, error: 'College leads cannot assign the Administrator role' };
    }
    return { allowed: true };
  }

  return { allowed: false, error: 'Forbidden' };
}

function serializeUserForViewer(user: {
  id: string;
  googleId: string;
  name: string;
  email: string;
  aliasName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  institutionId: string | null;
  privacyConsentAcceptedAt: Date | null;
  privacyPolicyVersion: string | null;
  createdAt: Date;
  updatedAt: Date;
}, viewerRole: string) {
  const base = {
    id: user.id,
    googleId: user.googleId,
    avatarUrl: user.avatarUrl,
    role: user.role,
    institutionId: user.institutionId,
    aliasName: user.aliasName,
    privacyConsentAcceptedAt: user.privacyConsentAcceptedAt,
    privacyPolicyVersion: user.privacyPolicyVersion,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (viewerRole === 'LOCAL_LEADER') {
    return {
      ...base,
      name: user.aliasName ?? 'Anonymous',
      email: '',
    };
  }

  return {
    ...base,
    name: user.name,
    email: user.email,
  };
}

router.get('/', (_req: Request, res: Response) => {
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
      orderBy: { name: 'asc' },
      ...(sessionUser.role === 'LOCAL_LEADER' && sessionUser.institutionId
        ? { where: { institutionId: sessionUser.institutionId } }
        : {}),
    });
    res.json(users.map((user) => serializeUserForViewer(user, sessionUser.role)));
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

type UpdateUserBody = {
  name?: unknown;
  role?: unknown;
  institutionId?: unknown;
  avatarUrl?: unknown;
};

router.get('/by-institution/:institutionId', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const { institutionId } = req.params;
  if (!institutionId) {
    res.status(400).json({ error: 'institutionId is required' });
    return;
  }
  if (sessionUser.role === 'LOCAL_LEADER' && sessionUser.institutionId !== institutionId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: { institutionId: institutionId as string },
      orderBy: { name: 'asc' },
    });
    res.json(users.map((user) => serializeUserForViewer(user, sessionUser.role)));
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/:userId', async (req: Request, res: Response) => {
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const rawUserId = req.params.userId;
  const targetUserId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
  if (!targetUserId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const body = req.body as UpdateUserBody;
  const name = body.name !== undefined ? body.name : undefined;
  const roleInput = body.role !== undefined ? body.role : undefined;
  const institutionIdInput = body.institutionId !== undefined ? body.institutionId : undefined;
  const avatarUrlInput = body.avatarUrl !== undefined ? body.avatarUrl : undefined;

  if (name !== undefined && typeof name !== 'string') {
    res.status(400).json({ error: 'name must be a string' });
    return;
  }
  if (roleInput !== undefined && !isUserRole(roleInput)) {
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

  try {
    const existing = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!existing) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (
      sessionUser.role === 'LOCAL_LEADER' &&
      existing.institutionId !== sessionUser.institutionId
    ) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (roleInput !== undefined) {
      const roleCheck = validateRoleChange({
        sessionUser,
        targetUserId,
        existingRole: existing.role,
        newRole: roleInput,
      });
      if (!roleCheck.allowed) {
        res.status(403).json({ error: roleCheck.error ?? 'Forbidden' });
        return;
      }
    }

    if (sessionUser.role === 'LOCAL_LEADER' && institutionIdInput !== undefined) {
      res.status(403).json({ error: 'College leads cannot change institution' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(typeof name === 'string' ? { name } : {}),
        ...(roleInput !== undefined ? { role: roleInput } : {}),
        ...(institutionIdInput !== undefined
          ? { institutionId: institutionIdInput as string | null }
          : {}),
        ...(avatarUrlInput !== undefined ? { avatarUrl: avatarUrlInput as string | null } : {}),
      },
    });

    res.json(serializeUserForViewer(updated, sessionUser.role));
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
