import { assignAliasName } from '@lib/assignAliasName';
import { ensureRubricVersionForRubric } from '@lib/rubricVersion';
import { AssignmentStatus, Prisma, UserRole, prisma, type User } from '@lib/prisma';
import { GENERAL_PATHWAY_ID } from '@shared/pathways';

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
    return ensureAliasName(recognizedUser);
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
  await assignAliasName({
    userId,
    institutionId: invitation.institutionId,
    client: transaction,
  });
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
    await assignAliasName({
      userId: user.id,
      institutionId: null,
      seed: identity.email,
      client: transaction,
    });
    return transaction.user.findUniqueOrThrow({ where: { id: user.id } });
  }

  await grantInvitationAccess(transaction, { userId: user.id, invitation });
  return transaction.user.findUniqueOrThrow({ where: { id: user.id } });
}

async function ensureAliasName(user: User): Promise<User> {
  if (user.aliasName) {
    return user;
  }

  await assignAliasName({
    userId: user.id,
    institutionId: user.institutionId,
    seed: user.email,
  });
  return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
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
    select: {
      id: true,
      institutionId: true,
      role: true,
      assignAllRubricsOnAccept: true,
    },
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
    pathwayId: string;
    status: AssignmentStatus;
  }[] = [];
  for (const { id: rubricId } of rubrics) {
    const rubricVersionId = await ensureRubricVersionForRubric(rubricId, transaction);
    rubricAssignmentRows.push({
      userId,
      rubricVersionId,
      pathwayId: GENERAL_PATHWAY_ID,
      status: AssignmentStatus.ASSIGNED,
    });
  }

  if (rubricAssignmentRows.length === 0) {
    return;
  }

  await transaction.userRubricAssignment.createMany({
    data: rubricAssignmentRows,
    skipDuplicates: true,
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
  return ensureAliasName(recognizedUser);
}
