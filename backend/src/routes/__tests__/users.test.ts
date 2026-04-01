import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('users routes', () => {
  const usersBasePath = '/users';
  const usersAllPath = '/users/all';

  const createdUserIds: string[] = [];
  let projectLeadId: string;
  let localLeaderId: string;
  let institutionId: string;
  let userAId: string;
  let userBId: string;

  const expectedUserById: Record<
    string,
    {
      googleId: string;
      name: string;
      email: string;
      role: string;
    }
  > = {};

  const authAgent = () => request.agent(app);

  function getExpectedUser(userId: string) {
    const expectedUser = expectedUserById[userId];
    expect(expectedUser).toBeDefined();
    if (!expectedUser) {
      throw new Error(`Expected test user data for id ${userId}`);
    }
    return expectedUser;
  }

  const loginAs = async (userId: string) => {
    const agent = authAgent();
    const loginResponse = await agent.get(`/auth/test-login/${userId}`);
    expect(loginResponse.status).toBe(200);
    return agent;
  };

  beforeAll(async () => {
    const timestamp = Date.now();

    const institution = await prisma.institution.create({
      data: { name: `users-test-inst-${timestamp}` },
    });
    institutionId = institution.id;

    const projectLead = await prisma.user.create({
      data: {
        googleId: `test-google-pl-${timestamp}`,
        name: 'Test Project Lead',
        email: `test-pl-${timestamp}@example.com`,
        role: 'PROJECT_LEAD',
      },
    });
    projectLeadId = projectLead.id;
    createdUserIds.push(projectLeadId);

    const localLeader = await prisma.user.create({
      data: {
        googleId: `test-google-ll-${timestamp}`,
        name: 'Test Local Leader',
        email: `test-ll-${timestamp}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId,
      },
    });
    localLeaderId = localLeader.id;
    createdUserIds.push(localLeaderId);

    const firstUser = await prisma.user.create({
      data: {
        googleId: `test-google-${timestamp}-a`,
        name: 'Test User A',
        email: `test-user-a-${timestamp}@example.com`,
        role: 'USER',
        institutionId,
      },
    });
    userAId = firstUser.id;
    createdUserIds.push(firstUser.id);
    expectedUserById[firstUser.id] = {
      googleId: firstUser.googleId,
      name: firstUser.name,
      email: firstUser.email,
      role: firstUser.role,
    };

    const secondUser = await prisma.user.create({
      data: {
        googleId: `test-google-${timestamp}-b`,
        name: 'Test User B',
        email: `test-user-b-${timestamp}@example.com`,
        role: 'FACULTY',
      },
    });
    userBId = secondUser.id;
    createdUserIds.push(secondUser.id);
    expectedUserById[secondUser.id] = {
      googleId: secondUser.googleId,
      name: secondUser.name,
      email: secondUser.email,
      role: secondUser.role,
    };
  });

  afterAll(async () => {
    if (createdUserIds.length === 0) return;

    await prisma.userCourseBin.deleteMany({
      where: { userId: { in: createdUserIds } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: createdUserIds } },
    });
    await prisma.institution.deleteMany({
      where: { id: institutionId },
    });
  });

  test('GET /users returns ok', async () => {
    const response = await request(app).get(usersBasePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /users/all returns 401 when not authenticated', async () => {
    const response = await request(app).get(usersAllPath);
    expect(response.status).toBe(401);
  });

  test('GET /users/all returns users for project lead', async () => {
    const agent = await loginAs(projectLeadId);
    const response = await agent.get(usersAllPath);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const apiUsers = response.body as Array<{
      id: string;
      googleId: string;
      name: string;
      email: string;
      role: string;
    }>;

    createdUserIds
      .filter((id) => id !== projectLeadId && id !== localLeaderId)
      .forEach((userId) => {
        const userFromApi = apiUsers.find((user) => user.id === userId);
        expect(userFromApi).toBeDefined();

        if (!userFromApi) return;

        const expectedUser = expectedUserById[userId];
        expect(expectedUser).toBeDefined();
        if (!expectedUser) return;

        expect(userFromApi.googleId).toBe(expectedUser.googleId);
        expect(userFromApi.name).toBe(expectedUser.name);
        expect(userFromApi.email).toBe(expectedUser.email);
        expect(userFromApi.role).toBe(expectedUser.role);
      });
  });

  test('GET /users/all returns only institution users for local leader', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(usersAllPath);

    expect(response.status).toBe(200);
    const apiUsers = response.body as Array<{ id: string }>;
    const ids = new Set(apiUsers.map((u) => u.id));

    expect(ids.has(localLeaderId)).toBe(true);
    expect(ids.has(userAId)).toBe(true);
    expect(ids.has(userBId)).toBe(false);
    expect(ids.has(projectLeadId)).toBe(false);
  });

  const byInstitutionPath = (id: string) => `/users/by-institution/${id}`;

  test('GET /users/by-institution/:institutionId returns 401 when not authenticated', async () => {
    const response = await request(app).get(byInstitutionPath(institutionId));
    expect(response.status).toBe(401);
  });

  test('GET /users/by-institution/:institutionId returns 403 for non-admin user', async () => {
    const agent = await loginAs(userAId);
    const response = await agent.get(byInstitutionPath(institutionId));
    expect(response.status).toBe(403);
  });

  test('GET /users/by-institution/:institutionId returns institution users for project lead', async () => {
    const agent = await loginAs(projectLeadId);
    const response = await agent.get(byInstitutionPath(institutionId));

    expect(response.status).toBe(200);
    const apiUsers = response.body as Array<{ id: string; institutionId: string | null }>;
    const ids = new Set(apiUsers.map((u) => u.id));

    expect(ids.has(localLeaderId)).toBe(true);
    expect(ids.has(userAId)).toBe(true);
    expect(ids.has(userBId)).toBe(false);
    expect(apiUsers.every((u) => u.institutionId === institutionId)).toBe(true);
  });

  test('GET /users/by-institution/:institutionId returns institution users for local leader', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(byInstitutionPath(institutionId));

    expect(response.status).toBe(200);
    const apiUsers = response.body as Array<{ id: string }>;
    const ids = new Set(apiUsers.map((u) => u.id));

    expect(ids.has(localLeaderId)).toBe(true);
    expect(ids.has(userAId)).toBe(true);
    expect(ids.has(userBId)).toBe(false);
  });

  test('PATCH /users/:id updates attributes for project lead', async () => {
    const targetId = userAId;

    const agent = await loginAs(projectLeadId);
    const response = await agent.patch(`/users/${targetId}`).send({
      name: 'Updated Name PL',
      role: 'FACULTY',
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Name PL');
    expect(response.body.role).toBe('FACULTY');

    const expectedUser = getExpectedUser(targetId);
    const reverted = await prisma.user.update({
      where: { id: targetId },
      data: {
        name: expectedUser.name,
        role: expectedUser.role as 'USER',
      },
    });
    expect(reverted.name).toBe(expectedUser.name);
  });

  test('PATCH /users/:id allows local leader for same institution', async () => {
    const targetId = userAId;

    const agent = await loginAs(localLeaderId);
    const response = await agent.patch(`/users/${targetId}`).send({
      name: 'Updated By LL',
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated By LL');

    const expectedUser = getExpectedUser(targetId);
    await prisma.user.update({
      where: { id: targetId },
      data: { name: expectedUser.name },
    });
  });

  test('PATCH /users/:id returns 403 when local leader targets other institution user', async () => {
    const targetId = userBId;

    const agent = await loginAs(localLeaderId);
    const response = await agent.patch(`/users/${targetId}`).send({
      name: 'Should Fail',
    });

    expect(response.status).toBe(403);
  });

  test('PATCH /users/:id returns 400 for invalid role', async () => {
    const agent = await loginAs(projectLeadId);
    const response = await agent.patch(`/users/${projectLeadId}`).send({
      role: 'SUPERADMIN',
    });

    expect(response.status).toBe(400);
  });

  test('PATCH /users/:id clears course bins when institution changes without courseBinIds', async () => {
    const predefined = await prisma.predefinedCourseBin.findFirst();
    if (!predefined) {
      expect(predefined).toBeDefined();
      return;
    }

    const courseBin = await prisma.courseBin.create({
      data: {
        institutionId,
        predefinedBinId: predefined.id,
        displayName: `cb-${randomUUID()}`,
      },
    });

    const targetId = userAId;

    await prisma.userCourseBin.deleteMany({ where: { userId: targetId } });
    await prisma.userCourseBin.create({
      data: { userId: targetId, courseBinId: courseBin.id },
    });

    const otherInstitution = await prisma.institution.create({
      data: { name: `other-inst-${randomUUID()}` },
    });

    try {
      const agent = await loginAs(projectLeadId);
      const response = await agent.patch(`/users/${targetId}`).send({
        institutionId: otherInstitution.id,
      });

      expect(response.status).toBe(200);
      const bins = await prisma.userCourseBin.findMany({ where: { userId: targetId } });
      expect(bins.length).toBe(0);
    } finally {
      await prisma.userCourseBin.deleteMany({ where: { userId: targetId } });
      await prisma.user.update({
        where: { id: targetId },
        data: { institutionId },
      });
      await prisma.courseBin.delete({ where: { id: courseBin.id } });
      await prisma.institution.delete({ where: { id: otherInstitution.id } });
    }
  });
});
