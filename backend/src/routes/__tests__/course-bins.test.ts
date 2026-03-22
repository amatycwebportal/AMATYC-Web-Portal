import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('course bins routes', () => {
  const courseBinsBasePath = '/course-bins';
  const courseBinsAllPath = '/course-bins/all';

  const institutionId = randomUUID();
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
      where: { id: { in: [courseBinIdAlpha, courseBinIdZebra] } },
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
      expect(
        rows[index - 1]?.displayName.localeCompare(rows[index]?.displayName ?? '')
      ).toBeLessThanOrEqual(0);
    }

    const createdIds = [courseBinIdAlpha, courseBinIdZebra];
    const ours = rows.filter((row) =>
      createdIds.includes(row.id as `${string}-${string}-${string}-${string}-${string}`)
    );

    expect(ours).toHaveLength(2);

    createdIds.forEach((courseBinId) => {
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
});
