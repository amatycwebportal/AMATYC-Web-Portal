import { prisma } from '@lib/prisma';
import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  INSTITUTION_DELETE_HIGH_IMPACT_RESPONSE_COUNT,
  INSTITUTION_DELETE_HIGH_IMPACT_USER_COUNT,
  USER_DELETE_HIGH_IMPACT_RESPONSE_COUNT,
} from '@shared/tpseAdmin';
import { requireTpseAdmin } from '@lib/requireTpseAdmin';

const router = Router();

type UserDeletionImpact = {
  userId: string;
  name: string;
  email: string;
  role: string;
  institutionId: string | null;
  institutionName: string | null;
  responseCount: number;
  consensusResponseCount: number;
  rubricAssignmentCount: number;
  courseBinLinkCount: number;
  invitationAuthoredCount: number;
  requiresTypedConfirmation: boolean;
  confirmationPhrase: string;
  warnings: string[];
};

type InstitutionDeletionImpact = {
  institutionId: string;
  name: string;
  academicSchoolYear: string;
  userCount: number;
  courseBinCount: number;
  courseCount: number;
  responseCount: number;
  consensusResponseCount: number;
  rubricAssignmentCount: number;
  userCourseBinLinkCount: number;
  invitationCount: number;
  localLeaderCount: number;
  usersDetachedNotDeleted: boolean;
  requiresTypedConfirmation: boolean;
  confirmationPhrase: string;
  warnings: string[];
};

async function fetchUserDeletionImpact(userId: string): Promise<UserDeletionImpact | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      institutionId: true,
      institution: { select: { name: true } },
    },
  });
  if (!user) return null;

  const [
    responseCount,
    consensusResponseCount,
    rubricAssignmentCount,
    courseBinLinkCount,
    invitationAuthoredCount,
  ] = await Promise.all([
    prisma.response.count({ where: { userId } }),
    prisma.consensusResponse.count({ where: { userId } }),
    prisma.userRubricAssignment.count({ where: { userId } }),
    prisma.userCourseBin.count({ where: { userId } }),
    prisma.invitation.count({ where: { invitedById: userId } }),
  ]);

  const warnings: string[] = [];
  if (responseCount > 0) {
    warnings.push(`${responseCount} rubric response(s) will be permanently deleted.`);
  }
  if (consensusResponseCount > 0) {
    warnings.push(`${consensusResponseCount} consensus response(s) will be permanently deleted.`);
  }
  if (rubricAssignmentCount > 0) {
    warnings.push(`${rubricAssignmentCount} rubric assignment(s) will be removed.`);
  }
  if (courseBinLinkCount > 0) {
    warnings.push(`${courseBinLinkCount} course-bin membership link(s) will be removed.`);
  }
  if (invitationAuthoredCount > 0) {
    warnings.push(
      `${invitationAuthoredCount} invitation(s) authored by this user will be kept, but the inviter link will be cleared.`
    );
  }
  if (user.role === 'LOCAL_LEADER') {
    warnings.push(
      'This user is a local leader. Their institution will keep other members; only this account is removed.'
    );
  }
  if (user.role === 'PROJECT_LEAD') {
    warnings.push(
      'This user is a project lead. Confirm you intend to remove project-level access.'
    );
  }

  const requiresTypedConfirmation =
    responseCount >= USER_DELETE_HIGH_IMPACT_RESPONSE_COUNT ||
    consensusResponseCount > 0 ||
    user.role === 'PROJECT_LEAD' ||
    user.role === 'LOCAL_LEADER';

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    institutionId: user.institutionId,
    institutionName: user.institution?.name ?? null,
    responseCount,
    consensusResponseCount,
    rubricAssignmentCount,
    courseBinLinkCount,
    invitationAuthoredCount,
    requiresTypedConfirmation,
    confirmationPhrase: user.email,
    warnings,
  };
}

async function fetchInstitutionDeletionImpact(
  institutionId: string
): Promise<InstitutionDeletionImpact | null> {
  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { id: true, name: true, academicSchoolYear: true },
  });
  if (!institution) return null;

  const institutionUsers = await prisma.user.findMany({
    where: { institutionId },
    select: { id: true, role: true },
  });
  const institutionUserIds = institutionUsers.map((user) => user.id);
  const localLeaderCount = institutionUsers.filter((user) => user.role === 'LOCAL_LEADER').length;

  const institutionCourseBins = await prisma.courseBin.findMany({
    where: { institutionId },
    select: { id: true },
  });
  const institutionCourseBinIds = institutionCourseBins.map((courseBin) => courseBin.id);

  const [
    courseCount,
    responseCount,
    consensusResponseCount,
    rubricAssignmentCount,
    userCourseBinLinkCount,
    invitationCount,
  ] = await Promise.all([
    institutionCourseBinIds.length === 0
      ? Promise.resolve(0)
      : prisma.course.count({ where: { courseBinId: { in: institutionCourseBinIds } } }),
    prisma.response.count({
      where: {
        OR: [
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    }),
    prisma.consensusResponse.count({
      where: {
        OR: [
          { institutionId },
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    }),
    prisma.userRubricAssignment.count({
      where: {
        OR: [
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    }),
    prisma.userCourseBin.count({
      where: {
        OR: [
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    }),
    prisma.invitation.count({ where: { institutionId } }),
  ]);

  const warnings: string[] = [
    'Users belonging to this institution are detached (institution cleared), not deleted.',
  ];
  if (responseCount > 0) {
    warnings.push(`${responseCount} rubric response(s) will be permanently deleted.`);
  }
  if (consensusResponseCount > 0) {
    warnings.push(`${consensusResponseCount} consensus response(s) will be permanently deleted.`);
  }
  if (institutionCourseBinIds.length > 0) {
    warnings.push(
      `${institutionCourseBinIds.length} course bin(s) and ${courseCount} course(s) will be deleted.`
    );
  }
  if (rubricAssignmentCount > 0) {
    warnings.push(`${rubricAssignmentCount} rubric assignment(s) will be removed.`);
  }
  if (invitationCount > 0) {
    warnings.push(
      `${invitationCount} pending/historical invitation(s) for this institution will be deleted.`
    );
  }
  if (localLeaderCount > 0) {
    warnings.push(
      `${localLeaderCount} local leader account(s) will lose their institution link but remain in the system.`
    );
  }

  const requiresTypedConfirmation =
    institutionUsers.length >= INSTITUTION_DELETE_HIGH_IMPACT_USER_COUNT ||
    responseCount >= INSTITUTION_DELETE_HIGH_IMPACT_RESPONSE_COUNT ||
    consensusResponseCount > 0 ||
    institutionCourseBinIds.length > 0;

  return {
    institutionId: institution.id,
    name: institution.name,
    academicSchoolYear: institution.academicSchoolYear,
    userCount: institutionUsers.length,
    courseBinCount: institutionCourseBinIds.length,
    courseCount,
    responseCount,
    consensusResponseCount,
    rubricAssignmentCount,
    userCourseBinLinkCount,
    invitationCount,
    localLeaderCount,
    usersDetachedNotDeleted: true,
    requiresTypedConfirmation,
    confirmationPhrase: institution.name,
    warnings,
  };
}

async function executeDeleteUser(userId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.response.deleteMany({ where: { userId } });
    await tx.consensusResponse.deleteMany({ where: { userId } });
    await tx.userRubricAssignment.deleteMany({ where: { userId } });
    await tx.userCourseBin.deleteMany({ where: { userId } });
    await tx.invitation.updateMany({
      where: { invitedById: userId },
      data: { invitedById: null },
    });
    await tx.user.delete({ where: { id: userId } });
  });
}

async function executeDeleteInstitution(institutionId: string): Promise<void> {
  const institutionUsers = await prisma.user.findMany({
    where: { institutionId },
    select: { id: true },
  });
  const institutionUserIds = institutionUsers.map((user) => user.id);

  const institutionCourseBins = await prisma.courseBin.findMany({
    where: { institutionId },
    select: { id: true },
  });
  const institutionCourseBinIds = institutionCourseBins.map((courseBin) => courseBin.id);

  await prisma.$transaction(async (tx) => {
    await tx.response.deleteMany({
      where: {
        OR: [
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    });

    await tx.consensusResponse.deleteMany({
      where: {
        OR: [
          { institutionId },
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    });

    await tx.userRubricAssignment.deleteMany({
      where: {
        OR: [
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    });

    await tx.userCourseBin.deleteMany({
      where: {
        OR: [
          { userId: { in: institutionUserIds } },
          { courseBinId: { in: institutionCourseBinIds } },
        ],
      },
    });

    await tx.course.deleteMany({
      where: { courseBinId: { in: institutionCourseBinIds } },
    });

    await tx.invitation.deleteMany({
      where: { institutionId },
    });

    await tx.courseBin.deleteMany({
      where: { institutionId },
    });

    await tx.user.updateMany({
      where: { institutionId },
      data: { institutionId: null },
    });

    await tx.institution.delete({
      where: { id: institutionId },
    });
  });
}

router.get('/users', async (req: Request, res: Response) => {
  if (!requireTpseAdmin(req, res)) return;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institutionId: true,
        avatarUrl: true,
        createdAt: true,
        institution: { select: { name: true } },
      },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.get('/users/:userId/deletion-impact', async (req: Request, res: Response) => {
  if (!requireTpseAdmin(req, res)) return;

  const userId = req.params.userId;
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    const impact = await fetchUserDeletionImpact(userId);
    if (!impact) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(impact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load user deletion impact' });
  }
});

router.delete('/users/:userId', async (req: Request, res: Response) => {
  const session = requireTpseAdmin(req, res);
  if (!session) return;

  const userId = req.params.userId;
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  if (userId === session.id) {
    res.status(400).json({ error: 'Cannot delete your own account from TPSE Admin' });
    return;
  }

  try {
    const impact = await fetchUserDeletionImpact(userId);
    if (!impact) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (impact.requiresTypedConfirmation) {
      const confirmationPhrase =
        typeof req.body?.confirmationPhrase === 'string' ? req.body.confirmationPhrase.trim() : '';
      if (confirmationPhrase !== impact.confirmationPhrase) {
        res.status(400).json({
          error: `High-impact delete requires typing the user email exactly: ${impact.confirmationPhrase}`,
        });
        return;
      }
    }

    await executeDeleteUser(userId);
    res.json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/institutions', async (req: Request, res: Response) => {
  if (!requireTpseAdmin(req, res)) return;

  try {
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        academicSchoolYear: true,
        createdAt: true,
        _count: { select: { users: true, courseBins: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(institutions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to list institutions' });
  }
});

router.get('/institutions/:institutionId/deletion-impact', async (req: Request, res: Response) => {
  if (!requireTpseAdmin(req, res)) return;

  const institutionId = req.params.institutionId;
  if (!institutionId) {
    res.status(400).json({ error: 'Institution ID is required' });
    return;
  }

  try {
    const impact = await fetchInstitutionDeletionImpact(institutionId);
    if (!impact) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }
    res.json(impact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load institution deletion impact' });
  }
});

router.delete('/institutions/:institutionId', async (req: Request, res: Response) => {
  if (!requireTpseAdmin(req, res)) return;

  const institutionId = req.params.institutionId;
  if (!institutionId) {
    res.status(400).json({ error: 'Institution ID is required' });
    return;
  }

  try {
    const impact = await fetchInstitutionDeletionImpact(institutionId);
    if (!impact) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }

    if (impact.requiresTypedConfirmation) {
      const confirmationPhrase =
        typeof req.body?.confirmationPhrase === 'string' ? req.body.confirmationPhrase.trim() : '';
      if (confirmationPhrase !== impact.confirmationPhrase) {
        res.status(400).json({
          error: `High-impact delete requires typing the institution name exactly: ${impact.confirmationPhrase}`,
        });
        return;
      }
    }

    await executeDeleteInstitution(institutionId);
    res.json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete institution' });
  }
});

export default router;
