import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
describe('predefined course bins routes', () => {
    const predefinedBasePath = '/predefined-course-bins';
    const predefinedAllPath = '/predefined-course-bins/all';
    const predefinedCreatePath = '/predefined-course-bins/create';
    const predefinedBinIdAlpha = randomUUID();
    const predefinedBinIdZebra = randomUUID();
    const nameSuffix = randomUUID();
    const alphaBinName = `Alpha predefined test ${nameSuffix}`;
    const zebraBinName = `Zebra predefined test ${nameSuffix}`;
    const extraPredefinedBinIdsToCleanup = [];
    const expectedBinById = {};
    beforeAll(async () => {
        await prisma.predefinedCourseBin.create({
            data: {
                id: predefinedBinIdZebra,
                binName: zebraBinName,
            },
        });
        await prisma.predefinedCourseBin.create({
            data: {
                id: predefinedBinIdAlpha,
                binName: alphaBinName,
            },
        });
        expectedBinById[predefinedBinIdAlpha] = { binName: alphaBinName };
        expectedBinById[predefinedBinIdZebra] = { binName: zebraBinName };
    });
    afterAll(async () => {
        await prisma.predefinedCourseBin.deleteMany({
            where: {
                id: {
                    in: [predefinedBinIdAlpha, predefinedBinIdZebra, ...extraPredefinedBinIdsToCleanup],
                },
            },
        });
    });
    test('GET /predefined-course-bins returns ok', async () => {
        const response = await request(app).get(predefinedBasePath);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
    test('GET /predefined-course-bins/all returns bins sorted by binName asc', async () => {
        const response = await request(app).get(predefinedAllPath);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const rows = response.body;
        for (let index = 1; index < rows.length; index += 1) {
            const previousRow = rows[index - 1];
            const currentRow = rows[index];
            if (!previousRow || !currentRow)
                continue;
            expect(previousRow.binName.localeCompare(currentRow.binName)).toBeLessThanOrEqual(0);
        }
        const createdIdSet = new Set([predefinedBinIdAlpha, predefinedBinIdZebra]);
        const ours = rows.filter((row) => createdIdSet.has(row.id));
        expect(ours).toHaveLength(2);
        createdIdSet.forEach((predefinedBinId) => {
            const row = ours.find((candidate) => candidate.id === predefinedBinId);
            expect(row).toBeDefined();
            const expected = expectedBinById[predefinedBinId];
            expect(expected).toBeDefined();
            if (!row || !expected)
                return;
            expect(row.binName).toBe(expected.binName);
        });
    });
    test('POST /predefined-course-bins/create persists a bin and returns it', async () => {
        const binName = `Posted predefined bin ${randomUUID()}`;
        const response = await request(app).post(predefinedCreatePath).send({
            name: binName,
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ binName });
        expect(typeof response.body.id).toBe('string');
        extraPredefinedBinIdsToCleanup.push(response.body.id);
        const fromDatabase = await prisma.predefinedCourseBin.findUnique({
            where: { id: response.body.id },
        });
        expect(fromDatabase).not.toBeNull();
        expect(fromDatabase?.binName).toBe(binName);
    });
    test('POST /predefined-course-bins/create responds 500 when binName already exists', async () => {
        const binName = `Duplicate predefined bin ${randomUUID()}`;
        const firstResponse = await request(app).post(predefinedCreatePath).send({ name: binName });
        expect(firstResponse.status).toBe(200);
        expect(firstResponse.body.id).toBeDefined();
        extraPredefinedBinIdsToCleanup.push(firstResponse.body.id);
        const secondResponse = await request(app).post(predefinedCreatePath).send({ name: binName });
        expect(secondResponse.status).toBe(500);
        expect(secondResponse.body).toMatchObject({
            error: 'Failed to create predefined course bin',
        });
    });
});
//# sourceMappingURL=predefined-course-bins.test.js.map