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
      data: { name: `invitations-test-${randomUUID()}` },
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
      data: { name: `invitations-test-${randomUUID()}` },
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
    const assignment = await prisma.userRubricAssignment.findUnique({
      where: {
        userId_rubricVersionId: { userId: inviteeUserId, rubricVersionId: latestVersion.id },
      },
    });
    expect(assignment).not.toBeNull();

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

  test('POST /invitations/invite returns 409 when a user with that email already exists', async () => {
    const invitee = await prisma.user.findUniqueOrThrow({ where: { id: inviteeUserId } });
    const testApp = buildInvitationsTestApp({
      id: inviterUserId,
      role: 'LOCAL_LEADER',
      institutionId,
    });
    const response = await request(testApp).post('/api/invitations/invite').send({
      email: invitee.email,
      role: 'USER',
      institutionId,
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'User already exists' });
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
    expect(response.body).toEqual({ status: 'ok' });

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
    expect(response.body).toEqual({ error: 'Forbidden' });
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
