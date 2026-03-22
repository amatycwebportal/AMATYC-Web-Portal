import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { env } from '@config/env';
import type { CourseBin, UserRole } from '@shared/types';
import crypto from 'crypto';
import { sendInviteEmail } from '@lib/mailer';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.post('/accept', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { token } = req.body as { token?: unknown };
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }
  const userId = (req.user as { id: string }).id;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { courseBins: true },
  });
  if (!invitation) {
    return res.status(404).json({ error: 'Invitation not found' });
  }
  if (invitation.acceptedAt) {
    return res.status(409).json({ error: 'Invitation already accepted' });
  }
  if (invitation.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invitation expired' });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { institutionId: invitation.institutionId, role: invitation.role },
    }),
    prisma.userCourseBin.createMany({
      data:
        invitation.courseBins?.map((courseBin: CourseBin) => ({
          userId: userId,
          courseBinId: courseBin.id,
        })) ?? [],
    }),
    prisma.invitation.update({
      where: { token },
      data: { acceptedAt: new Date() },
    }),
  ]);

  return res.json({ status: 'ok' });
});

router.post('/invite', async (req: Request, res: Response) => {
  const { email, role, institutionId, invitedByUserId, courseBinIds } = req.body as {
    email?: unknown;
    role?: unknown;
    institutionId?: unknown;
    invitedByUserId?: unknown;
    courseBinIds?: string[];
  };
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!role || typeof role !== 'string') {
    return res.status(400).json({ error: 'Role is required' });
  }
  if (!institutionId || typeof institutionId !== 'string') {
    return res.status(400).json({ error: 'Institution ID is required' });
  }
  //Check if user already exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (user) {
    return res.status(409).json({ error: 'User already exists' });
  }

  //Create invitation

  const invitation = await prisma.invitation.create({
    data: {
      email: email,
      institutionId: institutionId,
      role: 'USER' as UserRole,
      courseBins: {
        connect:
          courseBinIds?.map((courseBinId: string) => ({
            id: courseBinId,
          })) ?? [],
      },
      token: crypto.randomBytes(32).toString('hex'),
      invitedByUser: {
        connect: {
          id: invitedByUserId as string,
        },
      },
    },
  });
  //invite email local leader to site call
  await sendInviteEmail(email, invitation.token);
  return res.json({ status: 'ok' });
});
export default router;
