import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, assert, beforeAll, describe, expect, test, vi } from 'vitest';
import { prisma } from '@lib/prisma';

vi.mock('@lib/mailer', () => ({
  sendInviteEmail: vi.fn().mockResolvedValue(undefined),
}));

import { sendInviteEmail } from '@lib/mailer';
import app from '../../app';

const sendInviteEmailMock = vi.mocked(sendInviteEmail);

describe('institution routes — create', () => {
  const createdInstitutionIds: string[] = [];
  let inviterUserId: string | undefined;

  beforeAll(async () => {
    const inviter = await prisma.user.create({
      data: {
        googleId: `test-inviter-google-${randomUUID()}`,
        name: 'Test Inviter',
        email: `test-inviter-${randomUUID()}@example.com`,
        role: 'PROJECT_LEAD',
      },
    });
    inviterUserId = inviter.id;
  });

  afterAll(async () => {
    if (createdInstitutionIds.length > 0) {
      await prisma.invitation.deleteMany({
        where: { institutionId: { in: createdInstitutionIds } },
      });
      await prisma.institution.deleteMany({
        where: { id: { in: createdInstitutionIds } },
      });
    }
    if (inviterUserId) {
      await prisma.user.delete({ where: { id: inviterUserId } });
    }
  });

  test('POST /institutions/create persists data and sends invite email', async () => {
    assert(inviterUserId, 'inviter should exist after beforeAll');
    sendInviteEmailMock.mockClear();

    const name = `Test institution ${randomUUID()}`;
    const localLeaderName = 'Test Local Leader';
    const localLeaderEmail = `local-leader-${randomUUID()}@example.com`;
    const invitedByuser = { id: inviterUserId };

    const response = await request(app)
      .post('/api/institutions/create')
      .send({ name, localLeaderName, localLeaderEmail, invitedByuser });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });

    const institutionRow = await prisma.institution.findFirst({
      where: { name },
    });

    assert(institutionRow, 'institution row should exist after create');

    createdInstitutionIds.push(institutionRow.id);
    expect(institutionRow.name).toBe(name);

    const invitationRow = await prisma.invitation.findFirst({
      where: { email: localLeaderEmail, institutionId: institutionRow.id },
    });
    assert(invitationRow, 'invitation row should exist after create');

    expect(sendInviteEmailMock).toHaveBeenCalledTimes(1);
    expect(sendInviteEmailMock).toHaveBeenCalledWith(localLeaderEmail, invitationRow.token);
  });

  test('POST /institutions/create returns 400 when required fields are missing', async () => {
    sendInviteEmailMock.mockClear();

    const response = await request(app).post('/api/institutions/create').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing required fields' });
    expect(sendInviteEmailMock).not.toHaveBeenCalled();
  });

  test('POST /institutions/create attaches existing signed-in user as local leader', async () => {
    assert(inviterUserId, 'inviter should exist after beforeAll');

    const existingLeader = await prisma.user.create({
      data: {
        googleId: `test-existing-leader-${randomUUID()}`,
        name: 'Existing User',
        email: `existing-leader-${randomUUID()}@example.com`,
        role: 'USER',
      },
    });

    try {
      sendInviteEmailMock.mockClear();

      const name = `Test institution ${randomUUID()}`;
      const response = await request(app)
        .post('/api/institutions/create')
        .send({
          name,
          localLeaderName: 'Invitee Name',
          localLeaderEmail: existingLeader.email,
          invitedByuser: { id: inviterUserId },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
      expect(sendInviteEmailMock).not.toHaveBeenCalled();

      const createdInstitution = await prisma.institution.findFirst({
        where: { name },
      });
      assert(createdInstitution);
      createdInstitutionIds.push(createdInstitution.id);

      const updatedUser = await prisma.user.findUniqueOrThrow({
        where: { id: existingLeader.id },
      });
      expect(updatedUser.role).toBe('LOCAL_LEADER');
      expect(updatedUser.institutionId).toBe(createdInstitution.id);
      expect(updatedUser.name).toBe('Invitee Name');
    } finally {
      await prisma.user.delete({ where: { id: existingLeader.id } });
    }
  });

  test('POST /institutions/create returns 409 when existing user already leads another institution', async () => {
    assert(inviterUserId, 'inviter should exist after beforeAll');

    const ledInstitution = await prisma.institution.create({
      data: { name: `Led institution ${randomUUID()}` },
    });
    createdInstitutionIds.push(ledInstitution.id);

    const existingLeader = await prisma.user.create({
      data: {
        googleId: `test-existing-local-leader-${randomUUID()}`,
        name: 'Existing Local Leader',
        email: `existing-local-leader-${randomUUID()}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId: ledInstitution.id,
      },
    });

    try {
      sendInviteEmailMock.mockClear();
      const name = `No reassignment institution ${randomUUID()}`;
      const response = await request(app)
        .post('/api/institutions/create')
        .send({
          name,
          localLeaderName: 'Invitee Name',
          localLeaderEmail: existingLeader.email,
          invitedByuser: { id: inviterUserId },
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'User is already assigned to another institution' });
      expect(sendInviteEmailMock).not.toHaveBeenCalled();

      const orphanInstitution = await prisma.institution.findFirst({
        where: { name },
      });
      expect(orphanInstitution).toBeNull();
    } finally {
      await prisma.user.delete({ where: { id: existingLeader.id } });
    }
  });

  test('POST /institutions/create returns 409 when invitation already exists and does not create institution', async () => {
    assert(inviterUserId, 'inviter should exist after beforeAll');

    const existingInstitution = await prisma.institution.create({
      data: { name: `Existing invitation institution ${randomUUID()}` },
    });
    createdInstitutionIds.push(existingInstitution.id);
    const existingInvitationEmail = `existing-invite-${randomUUID()}@example.com`;
    await prisma.invitation.create({
      data: {
        email: existingInvitationEmail,
        institutionId: existingInstitution.id,
        role: 'LOCAL_LEADER',
        token: randomUUID().replaceAll('-', ''),
        invitedByUser: {
          connect: {
            id: inviterUserId,
          },
        },
      },
    });

    try {
      sendInviteEmailMock.mockClear();
      const name = `No orphan institution ${randomUUID()}`;
      const response = await request(app)
        .post('/api/institutions/create')
        .send({
          name,
          localLeaderName: 'Invitee Name',
          localLeaderEmail: existingInvitationEmail,
          invitedByuser: { id: inviterUserId },
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Invitation already exists for this email' });
      expect(sendInviteEmailMock).not.toHaveBeenCalled();

      const orphanInstitution = await prisma.institution.findFirst({
        where: { name },
      });
      expect(orphanInstitution).toBeNull();
    } finally {
      await prisma.invitation.deleteMany({
        where: { email: existingInvitationEmail },
      });
    }
  });
});
