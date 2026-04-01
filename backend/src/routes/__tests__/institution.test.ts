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

  test('POST /institutions/create returns 409 when user already exists', async () => {
    assert(inviterUserId, 'inviter should exist after beforeAll');

    const existingLeader = await prisma.user.create({
      data: {
        googleId: `test-existing-leader-${randomUUID()}`,
        name: 'Existing Local Leader',
        email: `existing-leader-${randomUUID()}@example.com`,
        role: 'LOCAL_LEADER',
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

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'User already exists' });
      expect(sendInviteEmailMock).not.toHaveBeenCalled();

      const orphanInstitution = await prisma.institution.findFirst({
        where: { name },
      });
      if (orphanInstitution) {
        createdInstitutionIds.push(orphanInstitution.id);
      }
    } finally {
      await prisma.user.delete({ where: { id: existingLeader.id } });
    }
  });
});
