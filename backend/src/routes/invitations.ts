import { ensureRubricVersionForRubric } from '@lib/rubricVersion';
import { AssignmentStatus, Prisma, prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
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

  const rubricAssignmentRows: {
    userId: string;
    rubricVersionId: string;
    status: AssignmentStatus;
  }[] = [];
  if (invitation.assignAllRubricsOnAccept) {
    const rubrics = await prisma.rubric.findMany({ select: { id: true } });
    for (const { id: rubricId } of rubrics) {
      const rubricVersionId = await ensureRubricVersionForRubric(rubricId);
      rubricAssignmentRows.push({
        userId,
        rubricVersionId,
        status: AssignmentStatus.ASSIGNED,
      });
    }
  }

  const transactionSteps: Prisma.PrismaPromise<unknown>[] = [
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
  ];
  if (rubricAssignmentRows.length > 0) {
    transactionSteps.push(
      prisma.userRubricAssignment.createMany({
        data: rubricAssignmentRows,
        skipDuplicates: true,
      })
    );
  }
  transactionSteps.push(
    prisma.invitation.update({
      where: { token },
      data: { acceptedAt: new Date() },
    })
  );
  await prisma.$transaction(transactionSteps);

  return res.json({ status: 'ok' });
});

router.post('/invite', async (req: Request, res: Response) => {
  const { email, role, institutionId, invitedByUserId, courseBinIds, assignAllRubricsOnAccept } =
    req.body as {
      email?: unknown;
      role?: unknown;
      institutionId?: unknown;
      invitedByUserId?: unknown;
      courseBinIds?: string[];
      assignAllRubricsOnAccept?: unknown;
    };
  const shouldAssignAllRubricsOnAccept = assignAllRubricsOnAccept === true;
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
      assignAllRubricsOnAccept: shouldAssignAllRubricsOnAccept,
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
