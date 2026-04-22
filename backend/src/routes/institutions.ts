import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { UserRole } from '@shared/types';
import crypto from 'crypto';
import { sendInviteEmail } from '@lib/mailer';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.get('/all', async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const sessionUser = req.user as { role?: string; institutionId?: string | null };
  if (sessionUser.role === 'PROJECT_LEAD') {
    const institutions = await prisma.institution.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    res.json(institutions);
    return;
  }
  if (sessionUser.role === 'LOCAL_LEADER') {
    if (!sessionUser.institutionId) {
      res.json([]);
      return;
    }
    const institution = await prisma.institution.findUnique({
      where: { id: sessionUser.institutionId },
      select: { id: true, name: true },
    });
    res.json(institution ? [institution] : []);
    return;
  }
  res.status(403).json({ error: 'Forbidden' });
});

router.post('/create', async (req: Request, res: Response) => {
  const { name, localLeaderName, localLeaderEmail, invitedByuser } = req.body;
  if (!name || !localLeaderName || !localLeaderEmail || !invitedByuser) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (
    typeof name !== 'string' ||
    typeof localLeaderName !== 'string' ||
    typeof localLeaderEmail !== 'string' ||
    typeof invitedByuser !== 'object' ||
    !invitedByuser ||
    typeof (invitedByuser as { id?: unknown }).id !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  const invitedByUserId = (invitedByuser as { id: string }).id;
  try {
    //Check if institution already exists
    const institution_check = await prisma.institution.findUnique({
      where: { name },
    });
    if (institution_check) {
      return res.status(409).json({ error: 'Institution already exists' });
    }

    //Check if user already exists
    const user = await prisma.user.findUnique({
      where: { email: localLeaderEmail },
    });
    if (user?.institutionId && ['PROJECT_LEAD', 'LOCAL_LEADER'].includes(user.role)) {
      return res.status(409).json({ error: 'User is already assigned to another institution' });
    }

    const invitation = await prisma.$transaction(async (tx) => {
      const institution = await tx.institution.create({
        data: { name },
      });

      if (user) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            name: localLeaderName.trim(),
            role: 'LOCAL_LEADER',
            institutionId: institution.id,
          },
        });
        return null;
      }

      const invitationByEmail = await tx.invitation.findUnique({
        where: { email: localLeaderEmail },
        select: { id: true },
      });
      if (invitationByEmail) {
        throw new Error('INVITATION_ALREADY_EXISTS');
      }

      return tx.invitation.create({
        data: {
          email: localLeaderEmail,
          institutionId: institution.id,
          role: 'LOCAL_LEADER' as UserRole,
          token: crypto.randomBytes(32).toString('hex'),
          invitedByUser: {
            connect: {
              id: invitedByUserId,
            },
          },
        },
      });
    });

    //invite email local leader to site call
    if (invitation) {
      await sendInviteEmail(localLeaderEmail, invitation.token);
    }
    res.json({ status: 'ok' });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVITATION_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'Invitation already exists for this email' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
