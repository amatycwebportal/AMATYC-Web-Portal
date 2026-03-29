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
  try {
    //Check if institution already exists
    const institution_check = await prisma.institution.findUnique({
      where: { name },
    });
    if (institution_check) {
      return res.status(409).json({ error: 'Institution already exists' });
    }

    //Create institution
    const institution = await prisma.institution.create({
      data: { name },
    });
    if (!institution) {
      return res.status(500).json({ error: 'Failed to create institution' });
    }

    //Check if user already exists
    const user = await prisma.user.findUnique({
      where: { email: localLeaderEmail },
    });
    if (user) {
      return res.status(409).json({ error: 'User already exists' });
    }

    //Create invitation

    const invitation = await prisma.invitation.create({
      data: {
        email: localLeaderEmail,
        institutionId: institution.id,
        role: 'LOCAL_LEADER' as UserRole,
        token: crypto.randomBytes(32).toString('hex'),
        invitedByUser: {
          connect: {
            id: invitedByuser.id,
          },
        },
      },
    });
    //invite email local leader to site call
    await sendInviteEmail(localLeaderEmail, invitation.token);
    res.json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
