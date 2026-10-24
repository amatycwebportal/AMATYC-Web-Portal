import { ensureRubricVersionForRubric } from '@lib/rubricVersion';
import { AssignmentStatus, Prisma, UserRole, prisma, type User } from '@lib/prisma';

const EMPTY_PROFILE_VALUE = '';
const PROFILE_PATH = '/profile';
const ASSIGNED_RUBRICS_PATH = '/rubrics/assigned';

export type GoogleSignInIdentity = {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string;
};

type InvitationGrant = {
  id: string;
  institutionId: string;
  role: UserRole;
  assignAllRubricsOnAccept: boolean;
  courseBins: { id: string }[];
};

type GoogleProfileSource = {
  id: string;
  displayName: string;
  emails?: { value: string }[] | undefined;
  photos?: { value: string }[] | undefined;
};

export function buildGoogleSignInIdentity(profile: GoogleProfileSource): GoogleSignInIdentity {
  return {
    googleId: profile.id,
    email: (profile.emails?.[0]?.value ?? EMPTY_PROFILE_VALUE).trim(),
    name: profile.displayName,
    avatarUrl: profile.photos?.[0]?.value ?? EMPTY_PROFILE_VALUE,
  };
}

export async function resolveUnrecognizedSignIn(identity: GoogleSignInIdentity): Promise<User> {
  const recognizedUser = await findRecognizedUser(identity);
  if (recognizedUser) {
    return recognizedUser;
  }

  return createUserForUnrecognizedSignIn(identity);
}

export async function grantInvitationAccess(
  transaction: Prisma.TransactionClient,
  params: { userId: string; invitation: InvitationGrant }
): Promise<void> {
  const { userId, invitation } = params;

  await transaction.user.update({
    where: { id: userId },
    data: { institutionId: invitation.institutionId, role: invitation.role },
  });
  await linkInvitationCourseBins(transaction, userId, invitation.courseBins);
  await assignInvitationRubrics(transaction, userId, invitation.assignAllRubricsOnAccept);
  await transaction.invitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() },
  });
}

export async function buildGoogleCallbackPath(params: {
  token: string | undefined;
  email: string | undefined;
}): Promise<string> {
  const invitationAlreadyAccepted = await hasAcceptedInviteTokenForEmail({
    token: params.token,
    email: params.email ?? EMPTY_PROFILE_VALUE,
  });
  if (invitationAlreadyAccepted) {
    return PROFILE_PATH;
  }
  if (params.token) {
    return `/accept-invite?token=${encodeURIComponent(params.token)}`;
  }
  return ASSIGNED_RUBRICS_PATH;
}

async function findRecognizedUser(identity: GoogleSignInIdentity): Promise<User | null> {
  const userByGoogleId = await prisma.user.findUnique({ where: { googleId: identity.googleId } });
  if (userByGoogleId) {
    return userByGoogleId;
  }
  if (!identity.email) {
    return null;
  }
  return prisma.user.findFirst({
    where: { email: { equals: identity.email, mode: 'insensitive' } },
  });
}

async function createUserForUnrecognizedSignIn(identity: GoogleSignInIdentity): Promise<User> {
  try {
    return await prisma.$transaction((transaction) =>
      insertUnrecognizedUser(transaction, identity)
    );
  } catch (error) {
    return recoverRecognizedUser(error, identity);
  }
}

async function insertUnrecognizedUser(
  transaction: Prisma.TransactionClient,
  identity: GoogleSignInIdentity
): Promise<User> {
  const invitation = await lockActiveInvitationByEmail(transaction, identity.email);
  const user = await transaction.user.create({ data: buildStandardUserData(identity) });
  if (!invitation) {
    return user;
  }

  await grantInvitationAccess(transaction, { userId: user.id, invitation });
  return transaction.user.findUniqueOrThrow({ where: { id: user.id } });
}

function buildStandardUserData(identity: GoogleSignInIdentity) {
  return {
    googleId: identity.googleId,
    email: identity.email,
    name: identity.name,
    avatarUrl: identity.avatarUrl,
    role: UserRole.USER,
  };
}

async function lockActiveInvitationByEmail(
  transaction: Prisma.TransactionClient,
  email: string
): Promise<InvitationGrant | null> {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    return null;
  }

  const rows = await transaction.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Invitation"
    WHERE lower(email) = lower(${normalizedEmail})
      AND "acceptedAt" IS NULL
      AND "expiresAt" > NOW()
    ORDER BY "createdAt" ASC
    LIMIT 1
    FOR UPDATE
  `;
  const invitationId = rows[0]?.id;
  if (!invitationId) {
    return null;
  }

  return transaction.invitation.findUnique({
    where: { id: invitationId },
    include: { courseBins: { select: { id: true } } },
  });
}

async function linkInvitationCourseBins(
  transaction: Prisma.TransactionClient,
  userId: string,
  courseBins: { id: string }[]
): Promise<void> {
  if (courseBins.length === 0) {
    return;
  }

  await transaction.userCourseBin.createMany({
    data: courseBins.map((courseBin) => ({
      userId,
      courseBinId: courseBin.id,
    })),
  });
}

async function assignInvitationRubrics(
  transaction: Prisma.TransactionClient,
  userId: string,
  shouldAssignAllRubrics: boolean
): Promise<void> {
  if (!shouldAssignAllRubrics) {
    return;
  }

  const rubrics = await transaction.rubric.findMany({ select: { id: true } });
  const rubricAssignmentRows: {
    userId: string;
    rubricVersionId: string;
    courseBinId: string | null;
    status: AssignmentStatus;
  }[] = [];
  for (const { id: rubricId } of rubrics) {
    const rubricVersionId = await ensureRubricVersionForRubric(rubricId);
    rubricAssignmentRows.push({
      userId,
      rubricVersionId,
      courseBinId: null,
      status: AssignmentStatus.ASSIGNED,
    });
  }

  if (rubricAssignmentRows.length === 0) {
    return;
  }

  await transaction.userRubricAssignment.createMany({
    data: rubricAssignmentRows,
  });
}

async function hasAcceptedInviteTokenForEmail(params: {
  token: string | undefined;
  email: string;
}): Promise<boolean> {
  const { token, email } = params;
  if (!token || !email) {
    return false;
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    select: { email: true, acceptedAt: true },
  });
  if (!invitation?.acceptedAt) {
    return false;
  }

  return invitation.email.toLowerCase() === email.trim().toLowerCase();
}

async function recoverRecognizedUser(
  error: unknown,
  identity: GoogleSignInIdentity
): Promise<User> {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    throw error;
  }

  const recognizedUser = await findRecognizedUser(identity);
  if (!recognizedUser) {
    throw error;
  }
  return recognizedUser;
}
