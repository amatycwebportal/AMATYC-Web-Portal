import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { AssignmentStatus, prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('course bins routes', () => {
  const courseBinsBasePath = '/api/course-bins';
  const courseBinsAllPath = '/api/course-bins/all';
  const courseBinsCreatePath = '/api/course-bins/create';

  const institutionId = randomUUID();
  const otherInstitutionId = randomUUID();
  const extraCourseBinIdsToCleanup: string[] = [];
  const predefinedBinId = randomUUID();
  const courseBinIdAlpha = randomUUID();
  const courseBinIdZebra = randomUUID();
  const otherCourseBinId = randomUUID();
  let localLeaderUserId: string;
  let otherLocalLeaderUserId: string;

  const expectedCourseBinById: Record<
    string,
    { displayName: string; institutionId: string; predefinedBinId: string }
  > = {};

  const authAgent = () => request.agent(app);

  const loginAs = async (userId: string) => {
    const agent = authAgent();
    const loginResponse = await agent.get(`/auth/test-login/${userId}`);
    expect(loginResponse.status).toBe(200);
    return agent;
  };

  beforeAll(async () => {
    await prisma.institution.create({
      data: { id: institutionId, name: 'Test institution for course bins' },
    });
    await prisma.institution.create({
      data: { id: otherInstitutionId, name: 'Other institution for course bins' },
    });
    await prisma.predefinedCourseBin.create({
      data: { id: predefinedBinId, binName: 'Test predefined bin' },
    });
    await prisma.courseBin.create({
      data: {
        id: courseBinIdZebra,
        displayName: 'Zebra test bin',
        institutionId,
        predefinedBinId,
      },
    });
    await prisma.courseBin.create({
      data: {
        id: courseBinIdAlpha,
        displayName: 'Alpha test bin',
        institutionId,
        predefinedBinId,
      },
    });
    await prisma.courseBin.create({
      data: {
        id: otherCourseBinId,
        displayName: 'Other institution bin',
        institutionId: otherInstitutionId,
        predefinedBinId,
      },
    });

    const timestamp = Date.now();
    const localLeader = await prisma.user.create({
      data: {
        googleId: `test-google-ll-cb-${timestamp}`,
        name: 'Course bins test local leader',
        email: `test-ll-cb-${timestamp}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId,
      },
    });
    localLeaderUserId = localLeader.id;

    const otherLocalLeader = await prisma.user.create({
      data: {
        googleId: `test-google-oll-cb-${timestamp}`,
        name: 'Other local leader',
        email: `test-oll-cb-${timestamp}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId: otherInstitutionId,
      },
    });
    otherLocalLeaderUserId = otherLocalLeader.id;

    expectedCourseBinById[courseBinIdAlpha] = {
      displayName: 'Alpha test bin',
      institutionId,
      predefinedBinId,
    };
    expectedCourseBinById[courseBinIdZebra] = {
      displayName: 'Zebra test bin',
      institutionId,
      predefinedBinId,
    };
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [localLeaderUserId, otherLocalLeaderUserId] } },
    });
    await prisma.courseBin.deleteMany({
      where: {
        id: {
          in: [courseBinIdAlpha, courseBinIdZebra, otherCourseBinId, ...extraCourseBinIdsToCleanup],
        },
      },
    });
    await prisma.predefinedCourseBin.delete({
      where: { id: predefinedBinId },
    });
    await prisma.institution.deleteMany({
      where: { id: { in: [institutionId, otherInstitutionId] } },
    });
  });

  test('GET /course-bins returns ok', async () => {
    const response = await request(app).get(courseBinsBasePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /course-bins/all returns course bins sorted by displayName asc', async () => {
    const response = await request(app).get(courseBinsAllPath);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    type CourseBinRow = {
      id: string;
      displayName: string;
      institutionId: string;
      predefinedBinId: string;
    };

    const rows = response.body as CourseBinRow[];

    for (let index = 1; index < rows.length; index += 1) {
      const previousRow = rows[index - 1];
      const currentRow = rows[index];
      if (!previousRow || !currentRow) continue;

      expect(previousRow.displayName.localeCompare(currentRow.displayName)).toBeLessThanOrEqual(0);
    }

    const createdIdSet = new Set<string>([courseBinIdAlpha, courseBinIdZebra]);
    const ours = rows.filter((row) => createdIdSet.has(row.id));

    expect(ours).toHaveLength(2);

    createdIdSet.forEach((courseBinId) => {
      const row = ours.find((candidate) => candidate.id === courseBinId);
      expect(row).toBeDefined();

      const expected = expectedCourseBinById[courseBinId];
      expect(expected).toBeDefined();
      if (!row || !expected) return;

      expect(row.displayName).toBe(expected.displayName);
      expect(row.institutionId).toBe(expected.institutionId);
      expect(row.predefinedBinId).toBe(expected.predefinedBinId);
    });
  });

  test('POST /course-bins/create persists a course bin and returns it', async () => {
    const displayName = 'Posted via API test bin';

    const response = await request(app).post(courseBinsCreatePath).send({
      name: displayName,
      institutionId,
      predefinedCourseBinId: predefinedBinId,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      displayName,
      institutionId,
      predefinedBinId: predefinedBinId,
    });
    expect(typeof response.body.id).toBe('string');
    extraCourseBinIdsToCleanup.push(response.body.id as string);

    const fromDatabase = await prisma.courseBin.findUnique({
      where: { id: response.body.id as string },
    });
    expect(fromDatabase).not.toBeNull();
    expect(fromDatabase?.displayName).toBe(displayName);
  });

  test('POST /course-bins/create responds 500 when institutionId is invalid', async () => {
    const unknownInstitutionId = randomUUID();

    const response = await request(app).post(courseBinsCreatePath).send({
      name: 'Orphan bin',
      institutionId: unknownInstitutionId,
      predefinedCourseBinId: predefinedBinId,
    });

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Failed to create course bin',
    });
  });

  test('POST /course-bins/create responds 500 when predefinedCourseBinId is invalid', async () => {
    const unknownPredefinedId = randomUUID();

    const response = await request(app).post(courseBinsCreatePath).send({
      name: 'Bad predefined ref',
      institutionId,
      predefinedCourseBinId: unknownPredefinedId,
    });

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Failed to create course bin',
    });
  });

  test('GET /course-bins/institution/:institutionId returns bins for that institution', async () => {
    const path = `/course-bins/institution/${institutionId}`;
    const response = await request(app).get(path);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const ids = (response.body as { id: string }[]).map((row) => row.id);
    expect(ids).toEqual(expect.arrayContaining([courseBinIdAlpha, courseBinIdZebra]));
  });

  test('GET /course-bins/institution/:institutionId returns an empty array when none exist', async () => {
    const emptyInstitutionId = randomUUID();
    await prisma.institution.create({
      data: { id: emptyInstitutionId, name: `Empty institution ${emptyInstitutionId}` },
    });

    try {
      const path = `/course-bins/institution/${emptyInstitutionId}`;
      const response = await request(app).get(path);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    } finally {
      await prisma.institution.delete({ where: { id: emptyInstitutionId } });
    }
  });

  test('PATCH /course-bins/:courseBinId returns 401 when not authenticated', async () => {
    const response = await request(app)
      .patch(`/course-bins/${courseBinIdAlpha}`)
      .send({ displayName: 'New name' });

    expect(response.status).toBe(401);
  });

  test('PATCH /course-bins/:courseBinId updates displayName for same-institution local leader', async () => {
    const agent = await loginAs(localLeaderUserId);
    const newName = 'Renamed alpha bin';

    const response = await agent.patch(`/course-bins/${courseBinIdAlpha}`).send({
      displayName: newName,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: 'Course bin updated',
      courseBin: { id: courseBinIdAlpha, displayName: newName },
    });

    const fromDatabase = await prisma.courseBin.findUnique({
      where: { id: courseBinIdAlpha },
    });
    expect(fromDatabase?.displayName).toBe(newName);

    await prisma.courseBin.update({
      where: { id: courseBinIdAlpha },
      data: { displayName: 'Alpha test bin' },
    });
  });

  test('PATCH /course-bins/:courseBinId returns 403 for a bin outside the local leader institution', async () => {
    const agent = await loginAs(localLeaderUserId);

    const response = await agent.patch(`/course-bins/${otherCourseBinId}`).send({
      displayName: 'Should not apply',
    });

    expect(response.status).toBe(403);
  });

  test('PATCH /course-bins/:courseBinId allows local leader to update a bin in their institution', async () => {
    const agent = await loginAs(otherLocalLeaderUserId);
    const response = await agent.patch(`/course-bins/${otherCourseBinId}`).send({
      displayName: 'Renamed by other leader',
    });

    expect(response.status).toBe(200);
    expect(response.body.courseBin.displayName).toBe('Renamed by other leader');

    await prisma.courseBin.update({
      where: { id: otherCourseBinId },
      data: { displayName: 'Other institution bin' },
    });
  });

  test('PATCH /course-bins/:courseBinId returns 400 when displayName is empty', async () => {
    const agent = await loginAs(localLeaderUserId);

    const response = await agent.patch(`/course-bins/${courseBinIdAlpha}`).send({
      displayName: '   ',
    });

    expect(response.status).toBe(400);
  });

  test('PATCH /course-bins/:courseBinId returns 400 when displayName is not a string', async () => {
    const agent = await loginAs(localLeaderUserId);

    const response = await agent.patch(`/course-bins/${courseBinIdAlpha}`).send({
      displayName: 12,
    });

    expect(response.status).toBe(400);
  });

  test('PATCH /course-bins/:courseBinId returns 404 for unknown id', async () => {
    const agent = await loginAs(localLeaderUserId);
    const unknownId = randomUUID();

    const response = await agent.patch(`/course-bins/${unknownId}`).send({
      displayName: 'Nope',
    });

    expect(response.status).toBe(404);
  });

  test('GET /course-bins/:courseBinId/deletion-impact returns 401 when not authenticated', async () => {
    const response = await request(app).get(`/course-bins/${courseBinIdAlpha}/deletion-impact`);

    expect(response.status).toBe(401);
  });

  test('GET /course-bins/:courseBinId/deletion-impact returns 403 outside institution for local leader', async () => {
    const agent = await loginAs(localLeaderUserId);
    const response = await agent.get(`/course-bins/${otherCourseBinId}/deletion-impact`);

    expect(response.status).toBe(403);
  });

  test('GET /course-bins/:courseBinId/deletion-impact returns counts for assigned users and matching responses', async () => {
    const binId = randomUUID();
    const timestamp = Date.now();
    const facultyUser = await prisma.user.create({
      data: {
        googleId: `test-google-faculty-di-${timestamp}`,
        name: 'Deletion impact faculty',
        email: `test-faculty-di-${timestamp}@example.com`,
        role: 'FACULTY',
        institutionId,
      },
    });

    await prisma.courseBin.create({
      data: {
        id: binId,
        displayName: 'Deletion impact bin',
        institutionId,
        predefinedBinId,
      },
    });

    await prisma.userCourseBin.create({
      data: { userId: facultyUser.id, courseBinId: binId },
    });

    const sampleLevelDescriptions = {
      '1': { label: 'Level 1', description: 'First' },
      '2': { label: 'Level 2', description: 'Second' },
    };

    const rubric = await prisma.rubric.create({
      data: {
        title: `deletion-impact-rubric-${timestamp}`,
        description: 'Test',
        active: true,
      },
    });
    const scale = await prisma.scale.create({
      data: {
        rubricId: rubric.id,
        prompt: 'Criterion',
        orderIndex: 0,
        editable: true,
        isGlobal: false,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    await prisma.scaleBin.create({
      data: { scaleId: scale.id, predefinedBinId },
    });
    const rubricVersion = await prisma.rubricVersion.create({
      data: { rubricId: rubric.id, versionNum: 1, changelog: 'v1' },
    });
    const scaleVersion = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersion.id,
        originalScaleId: scale.id,
        prompt: scale.prompt,
        orderIndex: scale.orderIndex,
        isGlobal: false,
        editable: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    await prisma.scaleVersionBin.create({
      data: { scaleVersionId: scaleVersion.id, predefinedBinId },
    });
    await prisma.userRubricAssignment.create({
      data: {
        userId: facultyUser.id,
        rubricVersionId: rubricVersion.id,
        status: AssignmentStatus.ASSIGNED,
      },
    });
    await prisma.response.create({
      data: {
        userId: facultyUser.id,
        rubricVersionId: rubricVersion.id,
        scaleVersionId: scaleVersion.id,
        predefinedBinId,
        score: 1,
        status: 'DRAFT',
      },
    });

    try {
      const agent = await loginAs(localLeaderUserId);
      const response = await agent.get(`/course-bins/${binId}/deletion-impact`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        assignedUserCount: 1,
        responseCount: 1,
      });
    } finally {
      await prisma.response.deleteMany({ where: { userId: facultyUser.id } });
      await prisma.userRubricAssignment.deleteMany({ where: { userId: facultyUser.id } });
      await prisma.userCourseBin.deleteMany({ where: { userId: facultyUser.id } });
      await prisma.scaleVersionBin.deleteMany({
        where: { scaleVersionId: scaleVersion.id },
      });
      await prisma.scaleVersion.delete({ where: { id: scaleVersion.id } });
      await prisma.rubricVersion.delete({ where: { id: rubricVersion.id } });
      await prisma.scaleBin.deleteMany({ where: { scaleId: scale.id } });
      await prisma.scale.delete({ where: { id: scale.id } });
      await prisma.rubric.delete({ where: { id: rubric.id } });
      await prisma.courseBin.delete({ where: { id: binId } });
      await prisma.user.delete({ where: { id: facultyUser.id } });
    }
  });

  test('DELETE /course-bins/:courseBinId removes bin, assignments, and orphan responses for that predefined bin', async () => {
    const binId = randomUUID();
    const timestamp = Date.now();
    const facultyUser = await prisma.user.create({
      data: {
        googleId: `test-google-faculty-del-${timestamp}`,
        name: 'Delete bin faculty',
        email: `test-faculty-del-${timestamp}@example.com`,
        role: 'FACULTY',
        institutionId,
      },
    });

    await prisma.courseBin.create({
      data: {
        id: binId,
        displayName: 'To delete bin',
        institutionId,
        predefinedBinId,
      },
    });
    await prisma.userCourseBin.create({
      data: { userId: facultyUser.id, courseBinId: binId },
    });

    const sampleLevelDescriptions = {
      '1': { label: 'Level 1', description: 'First' },
      '2': { label: 'Level 2', description: 'Second' },
    };

    const rubric = await prisma.rubric.create({
      data: {
        title: `delete-bin-rubric-${timestamp}`,
        description: 'Test',
        active: true,
      },
    });
    const scale = await prisma.scale.create({
      data: {
        rubricId: rubric.id,
        prompt: 'Criterion',
        orderIndex: 0,
        editable: true,
        isGlobal: false,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    await prisma.scaleBin.create({
      data: { scaleId: scale.id, predefinedBinId },
    });
    const rubricVersion = await prisma.rubricVersion.create({
      data: { rubricId: rubric.id, versionNum: 1, changelog: 'v1' },
    });
    const scaleVersion = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersion.id,
        originalScaleId: scale.id,
        prompt: scale.prompt,
        orderIndex: scale.orderIndex,
        isGlobal: false,
        editable: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    await prisma.scaleVersionBin.create({
      data: { scaleVersionId: scaleVersion.id, predefinedBinId },
    });
    await prisma.userRubricAssignment.create({
      data: {
        userId: facultyUser.id,
        rubricVersionId: rubricVersion.id,
        status: AssignmentStatus.ASSIGNED,
      },
    });
    const responseRow = await prisma.response.create({
      data: {
        userId: facultyUser.id,
        rubricVersionId: rubricVersion.id,
        scaleVersionId: scaleVersion.id,
        predefinedBinId,
        score: 2,
        status: 'DRAFT',
      },
    });

    const agent = await loginAs(localLeaderUserId);
    const deleteResponse = await agent.delete(`/course-bins/${binId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toMatchObject({ message: 'Course bin deleted' });

    const binStill = await prisma.courseBin.findUnique({ where: { id: binId } });
    expect(binStill).toBeNull();

    const assignmentStill = await prisma.userCourseBin.findUnique({
      where: { userId_courseBinId: { userId: facultyUser.id, courseBinId: binId } },
    });
    expect(assignmentStill).toBeNull();

    const responseStill = await prisma.response.findUnique({ where: { id: responseRow.id } });
    expect(responseStill).toBeNull();

    await prisma.userRubricAssignment.deleteMany({ where: { userId: facultyUser.id } });
    await prisma.scaleVersionBin.deleteMany({
      where: { scaleVersionId: scaleVersion.id },
    });
    await prisma.scaleVersion.delete({ where: { id: scaleVersion.id } });
    await prisma.rubricVersion.delete({ where: { id: rubricVersion.id } });
    await prisma.scaleBin.deleteMany({ where: { scaleId: scale.id } });
    await prisma.scale.delete({ where: { id: scale.id } });
    await prisma.rubric.delete({ where: { id: rubric.id } });
    await prisma.user.delete({ where: { id: facultyUser.id } });
  });

  test('DELETE /course-bins/:courseBinId returns 401 when not authenticated', async () => {
    const response = await request(app).delete(`/course-bins/${courseBinIdAlpha}`);

    expect(response.status).toBe(401);
  });

  test('PATCH /course-bins/:courseBinId allows project lead to update any institution bin', async () => {
    const timestamp = Date.now();
    const projectLead = await prisma.user.create({
      data: {
        googleId: `test-google-pl-cb-${timestamp}`,
        name: 'Course bins test project lead',
        email: `test-pl-cb-${timestamp}@example.com`,
        role: 'PROJECT_LEAD',
      },
    });

    try {
      const agent = await loginAs(projectLead.id);
      const response = await agent.patch(`/course-bins/${otherCourseBinId}`).send({
        displayName: 'Updated by project lead',
      });

      expect(response.status).toBe(200);
      expect(response.body.courseBin.displayName).toBe('Updated by project lead');

      await prisma.courseBin.update({
        where: { id: otherCourseBinId },
        data: { displayName: 'Other institution bin' },
      });
    } finally {
      await prisma.user.delete({ where: { id: projectLead.id } });
    }
  });
});
