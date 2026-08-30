import { randomBytes, randomUUID } from 'crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import { afterAll, assert, beforeAll, describe, expect, test, vi } from 'vitest';

import { sendInviteEmail } from '@lib/mailer';
import { prisma } from '@lib/prisma';
import invitationsRouter from '../invitations';

vi.mock('@lib/mailer', () => ({
  sendInviteEmail: vi.fn().mockResolvedValue(undefined),
}));

const MILLISECONDS_PER_DAY = 86_400_000;

type TestSessionUser = {
  id: string;
  role: 'PROJECT_LEAD' | 'LOCAL_LEADER' | 'FACULTY' | 'USER';
  institutionId?: string | null;
};

function attachUserMiddleware(user: TestSessionUser | undefined) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (user) {
      (req as Request & { user: TestSessionUser }).user = user;
    }
    next();
  };
}

function buildInvitationsTestApp(user: TestSessionUser | undefined) {
  const testApp = express();
  testApp.use(express.json());
  testApp.use(attachUserMiddleware(user));
  testApp.use('/api/invitations', invitationsRouter);
  return testApp;
}

describe('invitations routes', () => {
  let institutionId: string;
  let secondInstitutionId: string;
  let inviteeUserId: string;
  let inviterUserId: string;
  let projectLeadUserId: string;
  let facultyUserId: string;
  let predefinedBinId: string;
  let courseBinId: string;
  const invitationIdsToDelete: string[] = [];

  beforeAll(async () => {
    const institution = await prisma.institution.create({
      data: { name: `invitations-test-${randomUUID()}`, academicSchoolYear: '25/26' },
    });
    institutionId = institution.id;

    const predefinedBin = await prisma.predefinedCourseBin.create({
      data: { binName: `invitations-predef-${randomUUID()}` },
    });
    predefinedBinId = predefinedBin.id;

    const courseBin = await prisma.courseBin.create({
      data: {
        displayName: 'Invitation test course bin',
        institutionId,
        predefinedBinId,
      },
    });
    courseBinId = courseBin.id;

    const invitee = await prisma.user.create({
      data: {
        googleId: `invitations-invitee-${randomUUID()}`,
        name: 'Invitee User',
        email: `invitations-invitee-${randomUUID()}@example.com`,
        role: 'USER',
      },
    });
    inviteeUserId = invitee.id;

    const inviter = await prisma.user.create({
      data: {
        googleId: `invitations-inviter-${randomUUID()}`,
        name: 'Inviter User',
        email: `invitations-inviter-${randomUUID()}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId,
      },
    });
    inviterUserId = inviter.id;

    const projectLead = await prisma.user.create({
      data: {
        googleId: `invitations-project-lead-${randomUUID()}`,
        name: 'Project Lead',
        email: `invitations-project-lead-${randomUUID()}@example.com`,
        role: 'PROJECT_LEAD',
      },
    });
    projectLeadUserId = projectLead.id;

    const faculty = await prisma.user.create({
      data: {
        googleId: `invitations-faculty-${randomUUID()}`,
        name: 'Faculty User',
        email: `invitations-faculty-${randomUUID()}@example.com`,
        role: 'FACULTY',
        institutionId,
      },
    });
    facultyUserId = faculty.id;

    const secondInstitution = await prisma.institution.create({
      data: { name: `invitations-test-${randomUUID()}`, academicSchoolYear: '25/26' },
    });
    secondInstitutionId = secondInstitution.id;
  });

  afterAll(async () => {
    if (invitationIdsToDelete.length > 0) {
      await prisma.invitation.deleteMany({
        where: { id: { in: invitationIdsToDelete } },
      });
    }
    await prisma.userCourseBin.deleteMany({
      where: { userId: inviteeUserId },
    });
    await prisma.userRubricAssignment.deleteMany({
      where: { userId: inviteeUserId },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [inviteeUserId, inviterUserId, projectLeadUserId, facultyUserId] } },
    });
    await prisma.courseBin.deleteMany({
      where: { id: courseBinId },
    });
    await prisma.predefinedCourseBin.delete({
      where: { id: predefinedBinId },
    });
    await prisma.institution.delete({
      where: { id: institutionId },
    });
    await prisma.institution.delete({
      where: { id: secondInstitutionId },
    });
  });

  test('GET /invitations returns ok', async () => {
    const testApp = buildInvitationsTestApp(undefined);
    const response = await request(testApp).get('/api/invitations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /invitations/accept returns 401 when not authenticated', async () => {
    const testApp = buildInvitationsTestApp(undefined);
    const response = await request(testApp).post('/api/invitations/accept').send({ token: 'any' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
  });

  test('POST /invitations/accept returns 400 when token is missing', async () => {
    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Token is required' });
  });

  test('POST /invitations/accept returns 400 when token is not a string', async () => {
    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token: 12345 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Token is required' });
  });

  test('POST /invitations/accept returns 404 when invitation does not exist', async () => {
    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp)
      .post('/api/invitations/accept')
      .send({ token: randomBytes(32).toString('hex') });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Invitation not found' });
  });

  test('POST /invitations/accept returns 409 when invitation was already accepted', async () => {
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `accepted-${randomUUID()}@example.com`,
        institutionId,
        role: 'LOCAL_LEADER',
        token,
        acceptedAt: new Date(),
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Invitation already accepted' });
  });

  test('POST /invitations/accept returns 400 when invitation is expired', async () => {
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `expired-${randomUUID()}@example.com`,
        institutionId,
        role: 'LOCAL_LEADER',
        token,
        expiresAt: new Date(Date.now() - MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invitation expired' });
  });

  test('POST /invitations/accept links user to institution and marks invitation accepted', async () => {
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `fresh-${randomUUID()}@example.com`,
        institutionId,
        role: 'LOCAL_LEADER',
        token,
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });

    const updatedUser = await prisma.user.findUniqueOrThrow({
      where: { id: inviteeUserId },
    });
    expect(updatedUser.institutionId).toBe(institutionId);
    expect(updatedUser.role).toBe('LOCAL_LEADER');

    const updatedInvitation = await prisma.invitation.findUniqueOrThrow({
      where: { token },
    });
    assert(updatedInvitation.acceptedAt, 'acceptedAt should be set');
    expect(updatedInvitation.acceptedAt.getTime()).toBeLessThanOrEqual(Date.now());
  });

  test('POST /invitations/accept creates userCourseBins from invitation course bins', async () => {
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `with-bins-${randomUUID()}@example.com`,
        institutionId,
        role: 'FACULTY',
        token,
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
        courseBins: { connect: [{ id: courseBinId }] },
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token });

    expect(response.status).toBe(200);

    const links = await prisma.userCourseBin.findMany({
      where: { userId: inviteeUserId, courseBinId },
    });
    expect(links).toHaveLength(1);
  });

  test('POST /invitations/accept assigns all rubrics when invitation flag is set', async () => {
    const rubric = await prisma.rubric.create({
      data: {
        title: `invite-all-rubrics-${randomUUID()}`,
        description: 'invitation test rubric',
        active: true,
      },
    });
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `all-rubrics-${randomUUID()}@example.com`,
        institutionId,
        role: 'USER',
        token,
        assignAllRubricsOnAccept: true,
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token });

    expect(response.status).toBe(200);

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId: rubric.id },
      orderBy: { versionNum: 'desc' },
    });
    assert(latestVersion);
    const assignment = await prisma.userRubricAssignment.findFirst({
      where: {
        userId: inviteeUserId,
        rubricVersionId: latestVersion.id,
      },
    });
    expect(assignment).not.toBeNull();

    await prisma.userRubricAssignment.deleteMany({ where: { userId: inviteeUserId } });
    await prisma.rubricVersion.deleteMany({ where: { rubricId: rubric.id } });
    await prisma.rubric.delete({ where: { id: rubric.id } });
  });

  test('POST /invitations/accept assigns all rubrics in general scope when flag is set even if invitation lists course bins', async () => {
    await prisma.userCourseBin.deleteMany({ where: { userId: inviteeUserId } });
    await prisma.userRubricAssignment.deleteMany({ where: { userId: inviteeUserId } });

    const rubric = await prisma.rubric.create({
      data: {
        title: `invite-all-rubrics-general-${randomUUID()}`,
        description: 'general scope with bins on invite',
        active: true,
      },
    });
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `all-rubrics-general-bins-${randomUUID()}@example.com`,
        institutionId,
        role: 'USER',
        token,
        assignAllRubricsOnAccept: true,
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
        courseBins: { connect: [{ id: courseBinId }] },
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const response = await request(testApp).post('/api/invitations/accept').send({ token });
    expect(response.status).toBe(200);

    const binLinks = await prisma.userCourseBin.findMany({
      where: { userId: inviteeUserId, courseBinId },
    });
    expect(binLinks).toHaveLength(1);

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId: rubric.id },
      orderBy: { versionNum: 'desc' },
    });
    assert(latestVersion);
    const generalAssignmentCount = await prisma.userRubricAssignment.count({
      where: {
        userId: inviteeUserId,
        rubricVersionId: latestVersion.id,
        courseBinId: null,
      },
    });
    expect(generalAssignmentCount).toBe(1);
    const binScopedAssignmentCount = await prisma.userRubricAssignment.count({
      where: {
        userId: inviteeUserId,
        rubricVersionId: latestVersion.id,
        courseBinId,
      },
    });
    expect(binScopedAssignmentCount).toBe(0);

    await prisma.userRubricAssignment.deleteMany({ where: { userId: inviteeUserId } });
    await prisma.userCourseBin.deleteMany({ where: { userId: inviteeUserId } });
    await prisma.rubricVersion.deleteMany({ where: { rubricId: rubric.id } });
    await prisma.rubric.delete({ where: { id: rubric.id } });
  });

  test('POST /invitations/accept creates one general (no course bin) assignment per rubric and rejects a second accept', async () => {
    const rubric = await prisma.rubric.create({
      data: {
        title: `invite-dup-check-${randomUUID()}`,
        description: 'duplicate prevention',
        active: true,
      },
    });
    const token = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email: `dup-check-${randomUUID()}@example.com`,
        institutionId,
        role: 'USER',
        token,
        assignAllRubricsOnAccept: true,
        expiresAt: new Date(Date.now() + MILLISECONDS_PER_DAY),
      },
    });
    invitationIdsToDelete.push(invitation.id);

    const testApp = buildInvitationsTestApp({ id: inviteeUserId, role: 'USER' });
    const firstResponse = await request(testApp).post('/api/invitations/accept').send({ token });
    expect(firstResponse.status).toBe(200);

    const secondResponse = await request(testApp).post('/api/invitations/accept').send({ token });
    expect(secondResponse.status).toBe(409);

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId: rubric.id },
      orderBy: { versionNum: 'desc' },
    });
    assert(latestVersion);

    const generalAssignmentCount = await prisma.userRubricAssignment.count({
      where: {
        userId: inviteeUserId,
        rubricVersionId: latestVersion.id,
        courseBinId: null,
      },
    });
    expect(generalAssignmentCount).toBe(1);

    await prisma.userRubricAssignment.deleteMany({ where: { userId: inviteeUserId } });
    await prisma.rubricVersion.deleteMany({ where: { rubricId: rubric.id } });
    await prisma.rubric.delete({ where: { id: rubric.id } });
  });

  test('POST /invitations/invite returns 400 when email is missing', async () => {
    const testApp = buildInvitationsTestApp({
      id: inviterUserId,
      role: 'LOCAL_LEADER',
      institutionId,
    });
    const response = await request(testApp).post('/api/invitations/invite').send({
      role: 'LOCAL_LEADER',
      institutionId,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email is required' });
    expect(sendInviteEmail).not.toHaveBeenCalled();
  });

  test('POST /invitations/invite returns 401 when not authenticated', async () => {
    const testApp = buildInvitationsTestApp(undefined);
    const response = await request(testApp)
      .post('/api/invitations/invite')
      .send({
        email: `role-missing-${randomUUID()}@example.com`,
        role: 'USER',
        institutionId,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
    expect(sendInviteEmail).not.toHaveBeenCalled();
  });

  test('POST /invitations/invite returns 403 for non-admin user', async () => {
    const testApp = buildInvitationsTestApp({
      id: facultyUserId,
      role: 'FACULTY',
      institutionId,
    });
    const response = await request(testApp)
      .post('/api/invitations/invite')
      .send({
        email: `forbidden-${randomUUID()}@example.com`,
        role: 'USER',
        institutionId,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden' });
    expect(sendInviteEmail).not.toHaveBeenCalled();
  });

  test('POST /invitations/invite returns 409 when a pending invitation already exists', async () => {
    vi.mocked(sendInviteEmail).mockClear();

    const email = `pending-dup-${randomUUID()}@example.com`;
    const testApp = buildInvitationsTestApp({
      id: projectLeadUserId,
      role: 'PROJECT_LEAD',
    });
    const firstResponse = await request(testApp).post('/api/invitations/invite').send({
      email,
      role: 'USER',
      institutionId,
    });
    expect(firstResponse.status).toBe(200);

    const created = await prisma.invitation.findUniqueOrThrow({ where: { email } });
    invitationIdsToDelete.push(created.id);

    const secondResponse = await request(testApp).post('/api/invitations/invite').send({
      email,
      role: 'USER',
      institutionId,
    });
    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toEqual({
      error: 'A pending invitation already exists for this email.',
    });
    expect(sendInviteEmail).toHaveBeenCalledTimes(1);
  });

  test('POST /invitations/invite assigns existing user without institution to local leader institution', async () => {
    vi.mocked(sendInviteEmail).mockClear();

    const existingUser = await prisma.user.create({
      data: {
        googleId: `invitations-existing-${randomUUID()}`,
        name: 'Existing User',
        email: `invitations-existing-${randomUUID()}@example.com`,
        role: 'USER',
      },
    });

    try {
      const testApp = buildInvitationsTestApp({
        id: inviterUserId,
        role: 'LOCAL_LEADER',
        institutionId,
      });
      const response = await request(testApp)
        .post('/api/invitations/invite')
        .send({
          email: existingUser.email,
          role: 'USER',
          institutionId,
          courseBinIds: [courseBinId],
          assignAllRubricsOnAccept: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok', assigned: true });
      expect(sendInviteEmail).not.toHaveBeenCalled();

      const updatedUser = await prisma.user.findUniqueOrThrow({
        where: { id: existingUser.id },
      });
      expect(updatedUser.institutionId).toBe(institutionId);
      expect(updatedUser.role).toBe('USER');

      const binLinks = await prisma.userCourseBin.findMany({
        where: { userId: existingUser.id, courseBinId },
      });
      expect(binLinks).toHaveLength(1);
    } finally {
      await prisma.userCourseBin.deleteMany({ where: { userId: existingUser.id } });
      await prisma.userRubricAssignment.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.delete({ where: { id: existingUser.id } });
    }
  });

  test('POST /invitations/invite assigns institution but keeps FACULTY role for existing faculty without institution', async () => {
    vi.mocked(sendInviteEmail).mockClear();

    const existingFaculty = await prisma.user.create({
      data: {
        googleId: `invitations-faculty-no-inst-${randomUUID()}`,
        name: 'Existing Faculty',
        email: `invitations-faculty-no-inst-${randomUUID()}@example.com`,
        role: 'FACULTY',
      },
    });

    try {
      const testApp = buildInvitationsTestApp({
        id: inviterUserId,
        role: 'LOCAL_LEADER',
        institutionId,
      });
      const response = await request(testApp).post('/api/invitations/invite').send({
        email: existingFaculty.email,
        role: 'USER',
        institutionId,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok', assigned: true });

      const updatedUser = await prisma.user.findUniqueOrThrow({
        where: { id: existingFaculty.id },
      });
      expect(updatedUser.institutionId).toBe(institutionId);
      expect(updatedUser.role).toBe('FACULTY');
    } finally {
      await prisma.user.delete({ where: { id: existingFaculty.id } });
    }
  });

  test('POST /invitations/invite adds course bins for user already at the same institution', async () => {
    vi.mocked(sendInviteEmail).mockClear();

    const existingMember = await prisma.user.create({
      data: {
        googleId: `invitations-same-inst-${randomUUID()}`,
        name: 'Same Institution User',
        email: `invitations-same-inst-${randomUUID()}@example.com`,
        role: 'USER',
        institutionId,
      },
    });

    try {
      const testApp = buildInvitationsTestApp({
        id: inviterUserId,
        role: 'LOCAL_LEADER',
        institutionId,
      });
      const response = await request(testApp)
        .post('/api/invitations/invite')
        .send({
          email: existingMember.email,
          role: 'USER',
          institutionId,
          courseBinIds: [courseBinId],
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok', assigned: true });
      expect(sendInviteEmail).not.toHaveBeenCalled();

      const binLinks = await prisma.userCourseBin.findMany({
        where: { userId: existingMember.id, courseBinId },
      });
      expect(binLinks).toHaveLength(1);
    } finally {
      await prisma.userCourseBin.deleteMany({ where: { userId: existingMember.id } });
      await prisma.user.delete({ where: { id: existingMember.id } });
    }
  });

  test('POST /invitations/invite returns 409 when existing user belongs to another institution', async () => {
    const existingMember = await prisma.user.create({
      data: {
        googleId: `invitations-other-inst-${randomUUID()}`,
        name: 'Other Institution User',
        email: `invitations-other-inst-${randomUUID()}@example.com`,
        role: 'USER',
        institutionId: secondInstitutionId,
      },
    });

    try {
      const testApp = buildInvitationsTestApp({
        id: inviterUserId,
        role: 'LOCAL_LEADER',
        institutionId,
      });
      const response = await request(testApp).post('/api/invitations/invite').send({
        email: existingMember.email,
        role: 'USER',
        institutionId,
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'User is already assigned to another institution' });
      expect(sendInviteEmail).not.toHaveBeenCalled();
    } finally {
      await prisma.user.delete({ where: { id: existingMember.id } });
    }
  });

  test('POST /invitations/invite returns 409 when existing user is a local leader at another institution', async () => {
    const otherLocalLeader = await prisma.user.create({
      data: {
        googleId: `invitations-other-leader-${randomUUID()}`,
        name: 'Other Local Leader',
        email: `invitations-other-leader-${randomUUID()}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId: secondInstitutionId,
      },
    });

    try {
      const testApp = buildInvitationsTestApp({
        id: inviterUserId,
        role: 'LOCAL_LEADER',
        institutionId,
      });
      const response = await request(testApp).post('/api/invitations/invite').send({
        email: otherLocalLeader.email,
        role: 'USER',
        institutionId,
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'User is already assigned to another institution' });
    } finally {
      await prisma.user.delete({ where: { id: otherLocalLeader.id } });
    }
  });

  test('POST /invitations/invite returns 409 when existing user is a local leader at the same institution', async () => {
    const sameInstitutionLeader = await prisma.user.create({
      data: {
        googleId: `invitations-same-leader-${randomUUID()}`,
        name: 'Same Institution Leader',
        email: `invitations-same-leader-${randomUUID()}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId,
      },
    });

    try {
      const testApp = buildInvitationsTestApp({
        id: inviterUserId,
        role: 'LOCAL_LEADER',
        institutionId,
      });
      const response = await request(testApp).post('/api/invitations/invite').send({
        email: sameInstitutionLeader.email,
        role: 'USER',
        institutionId,
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: 'User is already a local leader at this institution',
      });
    } finally {
      await prisma.user.delete({ where: { id: sameInstitutionLeader.id } });
    }
  });

  test('POST /invitations/invite returns 409 when existing user is a project lead', async () => {
    const testApp = buildInvitationsTestApp({
      id: inviterUserId,
      role: 'LOCAL_LEADER',
      institutionId,
    });
    const projectLead = await prisma.user.findUniqueOrThrow({ where: { id: projectLeadUserId } });
    const response = await request(testApp).post('/api/invitations/invite').send({
      email: projectLead.email,
      role: 'USER',
      institutionId,
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Cannot invite an existing project lead' });
    expect(sendInviteEmail).not.toHaveBeenCalled();
  });

  test('POST /invitations/invite creates invitation with provided role for project lead', async () => {
    vi.mocked(sendInviteEmail).mockClear();

    const email = `new-invite-${randomUUID()}@example.com`;
    const testApp = buildInvitationsTestApp({
      id: projectLeadUserId,
      role: 'PROJECT_LEAD',
    });
    const response = await request(testApp)
      .post('/api/invitations/invite')
      .send({
        email,
        role: 'LOCAL_LEADER',
        institutionId,
        courseBinIds: [courseBinId],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', assigned: false });

    const created = await prisma.invitation.findUniqueOrThrow({ where: { email } });
    invitationIdsToDelete.push(created.id);

    expect(created.institutionId).toBe(institutionId);
    expect(created.role).toBe('LOCAL_LEADER');
    expect(created.invitedById).toBe(projectLeadUserId);
    expect(created.token.length).toBeGreaterThan(0);
    expect(created.assignAllRubricsOnAccept).toBe(false);

    const linkedBins = await prisma.invitation.findUnique({
      where: { id: created.id },
      include: { courseBins: true },
    });
    expect(linkedBins?.courseBins.map((bin) => bin.id)).toEqual([courseBinId]);

    expect(sendInviteEmail).toHaveBeenCalledTimes(1);
    expect(sendInviteEmail).toHaveBeenCalledWith(email, created.token);
  });

  test('POST /invitations/invite stores assignAllRubricsOnAccept when true', async () => {
    vi.mocked(sendInviteEmail).mockClear();

    const email = `all-rubrics-flag-${randomUUID()}@example.com`;
    const testApp = buildInvitationsTestApp({
      id: projectLeadUserId,
      role: 'PROJECT_LEAD',
    });
    const response = await request(testApp).post('/api/invitations/invite').send({
      email,
      role: 'USER',
      institutionId,
      assignAllRubricsOnAccept: true,
    });

    expect(response.status).toBe(200);

    const created = await prisma.invitation.findUniqueOrThrow({ where: { email } });
    invitationIdsToDelete.push(created.id);
    expect(created.assignAllRubricsOnAccept).toBe(true);
  });

  test('POST /invitations/invite blocks local leader inviting to another institution', async () => {
    const testApp = buildInvitationsTestApp({
      id: inviterUserId,
      role: 'LOCAL_LEADER',
      institutionId,
    });
    const response = await request(testApp)
      .post('/api/invitations/invite')
      .send({
        email: `wrong-inst-${randomUUID()}@example.com`,
        role: 'USER',
        institutionId: secondInstitutionId,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: 'Local leaders can only invite users to their own institution.',
    });
  });

  test('POST /invitations/invite blocks local leader inviting non-USER role', async () => {
    const testApp = buildInvitationsTestApp({
      id: inviterUserId,
      role: 'LOCAL_LEADER',
      institutionId,
    });
    const response = await request(testApp)
      .post('/api/invitations/invite')
      .send({
        email: `not-user-role-${randomUUID()}@example.com`,
        role: 'FACULTY',
        institutionId,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Local leaders can only invite USER role' });
  });
});
