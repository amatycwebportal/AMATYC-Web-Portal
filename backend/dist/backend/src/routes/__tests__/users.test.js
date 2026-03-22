import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
describe('users routes', () => {
    const usersBasePath = '/users';
    const usersAllPath = '/users/all';
    const createdUserIds = [];
    const expectedUserById = {};
    beforeAll(async () => {
        const timestamp = Date.now();
        const firstUser = await prisma.user.create({
            data: {
                googleId: `test-google-${timestamp}-a`,
                name: 'Test User A',
                email: `test-user-a-${timestamp}@example.com`,
                role: 'USER',
            },
        });
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
        createdUserIds.push(secondUser.id);
        expectedUserById[secondUser.id] = {
            googleId: secondUser.googleId,
            name: secondUser.name,
            email: secondUser.email,
            role: secondUser.role,
        };
    });
    afterAll(async () => {
        if (createdUserIds.length === 0)
            return;
        await prisma.user.deleteMany({
            where: { id: { in: createdUserIds } },
        });
    });
    test('GET /users returns ok', async () => {
        const response = await request(app).get(usersBasePath);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
    test('GET /users/all returns users including seeded test users', async () => {
        const response = await request(app).get(usersAllPath);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const apiUsers = response.body;
        expect(createdUserIds.length).toBeGreaterThan(0);
        createdUserIds.forEach((userId) => {
            const userFromApi = apiUsers.find((user) => user.id === userId);
            expect(userFromApi).toBeDefined();
            if (!userFromApi)
                return;
            const expectedUser = expectedUserById[userId];
            expect(expectedUser).toBeDefined();
            if (!expectedUser)
                return;
            expect(userFromApi.googleId).toBe(expectedUser.googleId);
            expect(userFromApi.name).toBe(expectedUser.name);
            expect(userFromApi.email).toBe(expectedUser.email);
            expect(userFromApi.role).toBe(expectedUser.role);
        });
    });
});
//# sourceMappingURL=users.test.js.map