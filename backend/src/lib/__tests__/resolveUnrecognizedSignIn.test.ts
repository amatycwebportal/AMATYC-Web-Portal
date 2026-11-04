import { randomBytes, randomUUID } from 'crypto';
import { afterAll, assert, beforeAll, describe, expect, test } from 'vitest';

import { prisma } from '@lib/prisma';
import { GENERAL_PATHWAY_ID } from '@shared/pathways';
import {
  buildGoogleCallbackPath,
  resolveUnrecognizedSignIn,
  type GoogleSignInIdentity,
} from '@lib/resolveUnrecognizedSignIn';

const MILLISECONDS_PER_DAY = 86_400_000;

function buildIdentity(email: string, googleId = `google-${randomUUID()}`): GoogleSignInIdentity {
  return {
    googleId,
    email,
    name: 'Invited Sign In',
    avatarUrl: '',
  };
}

describe('resolveUnrecognizedSignIn', () => {
  let institutionId: string;
  const userIdsToDelete: string[] = [];
  const invitationIdsToDelete: string[] = [];
  const rubricIdsToDelete: string[] = [];

  beforeAll(async () => {
    const institution = await prisma.institution.create({
      data: { name: `sign-in-invite-${randomUUID()}`, academicSchoolYear: '25/26' },
    });
    institutionId = institution.id;
  });

  afterAll(async () => {
    if (userIdsToDelete.length > 0) {
      await prisma.userRubricAssignment.deleteMany({ where: { userId: { in: userIdsToDelete } } });
      await prisma.user.deleteMany({ where: { id: { in: userIdsToDelete } } });
    }
    if (invitationIdsToDelete.length > 0) {
      await prisma.invitation.deleteMany({ where: { id: { in: invitationIdsToDelete } } });
    }
    await prisma.institution.delete({ where: { id: institutionId } });
    if (rubricIdsToDelete.length > 0) {
      await prisma.rubricVersion.deleteMany({ where: { rubricId: { in: rubricIdsToDelete } } });
      await prisma.rubric.deleteMany({ where: { id: { in: rubricIdsToDelete } } });
    }
  });

  test('returns the existing user when the Google account is already registered', async () => {
    const email = `recognized-${randomUUID()}@example.com`;
    const googleId = `recognized-google-${randomUUID()}`;
    const existingUser = await prisma.user.create({
      data: {
        googleId,
        email,
        name: 'Recognized User',
        role: 'USER',
      },
    });
    userIdsToDelete.push(existingUser.id);

    const invitation = await prisma.invitation.create({
      data: {
        email: `other-${randomUUID()}@example.com`,
        institutionId,
        role: 'LOCAL_LEADER',
        token: randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const user = await resolveUnrecognizedSignIn(buildIdentity(email, googleId));

    expect(user.id).toBe(existingUser.id);
    expect(user.role).toBe('USER');
    expect(user.institutionId).toBeNull();
  });

  test('signs up an unrecognized email as the invitee when an active invitation exists', async () => {
    const email = `Invited.User-${randomUUID()}@Example.com`;
    const rubric = await prisma.rubric.create({
      data: {
        title: `sign-in-invite-rubric-${randomUUID()}`,
        description: 'assigned because the invitation says so',
        active: true,
      },
    });
    rubricIdsToDelete.push(rubric.id);

    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        institutionId,
        role: 'USER',
        token: randomBytes(32).toString('hex'),
        assignAllRubricsOnAccept: true,
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const user = await resolveUnrecognizedSignIn(buildIdentity(email));
    userIdsToDelete.push(user.id);

    expect(user.role).toBe('USER');
    expect(user.institutionId).toBe(institutionId);
    expect(user.email).toBe(email);
    expect(user.aliasName).toBeTruthy();

    const updatedInvitation = await prisma.invitation.findUniqueOrThrow({
      where: { id: invitation.id },
    });
    assert(updatedInvitation.acceptedAt, 'active invitation should be accepted at sign-up');

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId: rubric.id },
      orderBy: { versionNum: 'desc' },
    });
    assert(latestVersion);
    const assignment = await prisma.userRubricAssignment.findFirst({
      where: {
        userId: user.id,
        rubricVersionId: latestVersion.id,
        pathwayId: GENERAL_PATHWAY_ID,
      },
    });
    expect(assignment).not.toBeNull();
  });

  test('creates a standard user when the matching invitation is expired', async () => {
    const email = `expired-${randomUUID()}@example.com`;
    const invitation = await prisma.invitation.create({
      data: {
        email,
        institutionId,
        role: 'LOCAL_LEADER',
        token: randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() - MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const user = await resolveUnrecognizedSignIn(buildIdentity(email));
    userIdsToDelete.push(user.id);

    expect(user.role).toBe('USER');
    expect(user.institutionId).toBeNull();

    const storedInvitation = await prisma.invitation.findUniqueOrThrow({
      where: { id: invitation.id },
    });
    expect(storedInvitation.acceptedAt).toBeNull();
  });

  test('creates a standard user when no invitation exists for the email', async () => {
    const user = await resolveUnrecognizedSignIn(
      buildIdentity(`unknown-${randomUUID()}@example.com`)
    );
    userIdsToDelete.push(user.id);

    expect(user.role).toBe('USER');
    expect(user.institutionId).toBeNull();
  });

  test('does not accept an invitation when the email already belongs to a user', async () => {
    const email = `existing-email-${randomUUID()}@example.com`;
    const existingUser = await prisma.user.create({
      data: {
        googleId: `existing-email-google-${randomUUID()}`,
        email,
        name: 'Existing Email',
        role: 'USER',
      },
    });
    userIdsToDelete.push(existingUser.id);

    const invitation = await prisma.invitation.create({
      data: {
        email,
        institutionId,
        role: 'LOCAL_LEADER',
        token: randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const user = await resolveUnrecognizedSignIn(buildIdentity(email));

    expect(user.id).toBe(existingUser.id);
    expect(user.role).toBe('USER');
    const storedInvitation = await prisma.invitation.findUniqueOrThrow({
      where: { id: invitation.id },
    });
    expect(storedInvitation.acceptedAt).toBeNull();
  });

  test('sends an already-accepted invite token to the profile path', async () => {
    const email = `callback-${randomUUID()}@example.com`;
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email,
        institutionId,
        role: 'USER',
        token,
        acceptedAt: new Date(),
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    await expect(buildGoogleCallbackPath({ token, email: email.toUpperCase() })).resolves.toBe(
      '/profile'
    );
    await expect(
      buildGoogleCallbackPath({ token, email: `other-${randomUUID()}@example.com` })
    ).resolves.toBe(`/accept-invite?token=${encodeURIComponent(token)}`);
    await expect(buildGoogleCallbackPath({ token: undefined, email })).resolves.toBe(
      '/rubrics/assigned'
    );
  });
});
