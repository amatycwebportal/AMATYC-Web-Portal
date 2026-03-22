import { randomBytes, randomUUID } from 'crypto';
import express, {} from 'express';
import request from 'supertest';
import { afterAll, assert, beforeAll, describe, expect, test } from 'vitest';
import invitationsRouter from '../invitations';
import { prisma } from '@lib/prisma';
const MILLISECONDS_PER_DAY = 86_400_000;
function attachUserMiddleware(user) {
    return (req, _res, next) => {
        if (user) {
            req.user = user;
        }
        next();
    };
}
function buildInvitationsTestApp(user) {
    const testApp = express();
    testApp.use(express.json());
    testApp.use(attachUserMiddleware(user));
    testApp.use('/invitations', invitationsRouter);
    return testApp;
}
describe('invitations routes', () => {
    let institutionId;
    let inviteeUserId;
    const invitationIdsToDelete = [];
    beforeAll(async () => {
        const institution = await prisma.institution.create({
            data: { name: `invitations-test-${randomUUID()}` },
        });
        institutionId = institution.id;
        const invitee = await prisma.user.create({
            data: {
                googleId: `invitations-invitee-${randomUUID()}`,
                name: 'Invitee User',
                email: `invitations-invitee-${randomUUID()}@example.com`,
                role: 'USER',
            },
        });
        inviteeUserId = invitee.id;
    });
    afterAll(async () => {
        if (invitationIdsToDelete.length > 0) {
            await prisma.invitation.deleteMany({
                where: { id: { in: invitationIdsToDelete } },
            });
        }
        await prisma.user.deleteMany({
            where: { id: inviteeUserId },
        });
        await prisma.institution.delete({
            where: { id: institutionId },
        });
    });
    test('GET /invitations returns ok', async () => {
        const testApp = buildInvitationsTestApp(undefined);
        const response = await request(testApp).get('/invitations');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
    test('POST /invitations/accept returns 401 when not authenticated', async () => {
        const testApp = buildInvitationsTestApp(undefined);
        const response = await request(testApp).post('/invitations/accept').send({ token: 'any' });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Not authenticated' });
    });
    test('POST /invitations/accept returns 400 when token is missing', async () => {
        const testApp = buildInvitationsTestApp({ id: inviteeUserId });
        const response = await request(testApp).post('/invitations/accept').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Token is required' });
    });
    test('POST /invitations/accept returns 404 when invitation does not exist', async () => {
        const testApp = buildInvitationsTestApp({ id: inviteeUserId });
        const response = await request(testApp)
            .post('/invitations/accept')
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
        const testApp = buildInvitationsTestApp({ id: inviteeUserId });
        const response = await request(testApp).post('/invitations/accept').send({ token });
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
        const testApp = buildInvitationsTestApp({ id: inviteeUserId });
        const response = await request(testApp).post('/invitations/accept').send({ token });
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
        const testApp = buildInvitationsTestApp({ id: inviteeUserId });
        const response = await request(testApp).post('/invitations/accept').send({ token });
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
});
//# sourceMappingURL=invitations.test.js.map