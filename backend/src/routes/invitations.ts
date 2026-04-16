import { ensureRubricVersionForRubric } from '@lib/rubricVersion';
import { AssignmentStatus, Prisma, prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { CourseBin, UserRole } from '@shared/types';
import crypto from 'crypto';
import { sendInviteEmail } from '@lib/mailer';
const router = Router();
const USER_ROLES: UserRole[] = ['PROJECT_LEAD', 'LOCAL_LEADER', 'FACULTY', 'USER'];

type SessionUser = {
  id: string;
  role: UserRole;
  institutionId: string | null;
};

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && USER_ROLES.includes(value as UserRole);
}

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
    courseBinId: string | null;
    status: AssignmentStatus;
  }[] = [];
  if (invitation.assignAllRubricsOnAccept) {
    const rubrics = await prisma.rubric.findMany({ select: { id: true } });
    for (const { id: rubricId } of rubrics) {
      const rubricVersionId = await ensureRubricVersionForRubric(rubricId);
      const invitationCourseBins = invitation.courseBins ?? [];
      if (invitationCourseBins.length === 0) {
        rubricAssignmentRows.push({
          userId,
          rubricVersionId,
          courseBinId: null,
          status: AssignmentStatus.ASSIGNED,
        });
      } else {
        for (const courseBin of invitationCourseBins) {
          rubricAssignmentRows.push({
            userId,
            rubricVersionId,
            courseBinId: courseBin.id,
            status: AssignmentStatus.ASSIGNED,
          });
        }
      }
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
  const sessionUser = requireAdminSession(req, res);
  if (!sessionUser) return;

  const { email, role, institutionId, courseBinIds, assignAllRubricsOnAccept } = req.body as {
    email?: unknown;
    role?: unknown;
    institutionId?: unknown;
    courseBinIds?: string[];
    assignAllRubricsOnAccept?: unknown;
  };
  const shouldAssignAllRubricsOnAccept = assignAllRubricsOnAccept === true;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!isUserRole(role)) {
    return res.status(400).json({ error: 'Role is required' });
  }
  if (!institutionId || typeof institutionId !== 'string') {
    return res.status(400).json({ error: 'Institution ID is required' });
  }
  if (
    courseBinIds !== undefined &&
    (!Array.isArray(courseBinIds) ||
      courseBinIds.some((courseBinId) => typeof courseBinId !== 'string'))
  ) {
    return res.status(400).json({ error: 'Course bin IDs must be an array of strings' });
  }

  if (sessionUser.role === 'LOCAL_LEADER') {
    if (!sessionUser.institutionId || sessionUser.institutionId !== institutionId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (role !== 'USER') {
      return res.status(403).json({ error: 'Local leaders can only invite USER role' });
    }
  }

  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { id: true },
  });
  if (!institution) {
    return res.status(400).json({ error: 'Institution not found' });
  }

  if (courseBinIds && courseBinIds.length > 0) {
    const bins = await prisma.courseBin.findMany({
      where: { id: { in: courseBinIds } },
      select: { id: true, institutionId: true },
    });
    if (bins.length !== courseBinIds.length) {
      return res.status(400).json({ error: 'Invalid course bin id' });
    }
    const hasWrongInstitution = bins.some((courseBin) => courseBin.institutionId !== institutionId);
    if (hasWrongInstitution) {
      return res.status(400).json({ error: 'Course bin does not belong to this institution' });
    }
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
      role: role,
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
          id: sessionUser.id,
        },
      },
    },
  });
  //invite email local leader to site call
  await sendInviteEmail(email, invitation.token);
  return res.json({ status: 'ok' });
});
export default router;
