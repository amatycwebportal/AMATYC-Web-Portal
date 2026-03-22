import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('course bins routes', () => {
  const courseBinsBasePath = '/course-bins';
  const courseBinsAllPath = '/course-bins/all';
  const courseBinsCreatePath = '/course-bins/create';

  const institutionId = randomUUID();
  const extraCourseBinIdsToCleanup: string[] = [];
  const predefinedBinId = randomUUID();
  const courseBinIdAlpha = randomUUID();
  const courseBinIdZebra = randomUUID();

  const expectedCourseBinById: Record<
    string,
    { displayName: string; institutionId: string; predefinedBinId: string }
  > = {};

  beforeAll(async () => {
    await prisma.institution.create({
      data: { id: institutionId, name: 'Test institution for course bins' },
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
    await prisma.courseBin.deleteMany({
      where: {
        id: { in: [courseBinIdAlpha, courseBinIdZebra, ...extraCourseBinIdsToCleanup] },
      },
    });
    await prisma.predefinedCourseBin.delete({
      where: { id: predefinedBinId },
    });
    await prisma.institution.delete({
      where: { id: institutionId },
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
});
