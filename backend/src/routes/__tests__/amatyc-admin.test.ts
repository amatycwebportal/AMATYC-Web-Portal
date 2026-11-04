import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { prisma } from '@lib/prisma';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { AMATYC_ADMIN_EMAIL } from '@shared/amatycAdmin';
import { GENERAL_PATHWAY_ID } from '@shared/pathways';
import app from '../../app';

describe('amatyc-admin routes', () => {
  const createdUserIds: string[] = [];
  const createdInstitutionIds: string[] = [];
  const createdInvitationIds: string[] = [];
  const createdResponseIds: string[] = [];
  const createdRubricIds: string[] = [];

  let amatycAdminId = '';
  let regularUserId = '';
  let facultyUserId = '';
  let institutionId = '';
  let rubricVersionId = '';
  let scaleVersionId = '';

  const authAgent = () => request.agent(app);

  const loginAs = async (userId: string) => {
    const agent = authAgent();
    const loginResponse = await agent.get(`/api/auth/test-login/${userId}`);
    expect(loginResponse.status).toBe(200);
    return agent;
  };

  const createConsentedUser = async (data: {
    googleId: string;
    name: string;
    email: string;
    role: 'PROJECT_LEAD' | 'LOCAL_LEADER' | 'USER';
    institutionId?: string;
  }) => {
    const user = await prisma.user.create({
      data: {
        ...data,
        privacyConsentAcceptedAt: new Date(),
        privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
      },
    });
    createdUserIds.push(user.id);
    return user;
  };

  beforeAll(async () => {
    const stamp = randomUUID();

    const institution = await prisma.institution.create({
      data: {
        name: `amatyc-admin-inst-${stamp}`,
        academicSchoolYear: '25/26',
      },
    });
    institutionId = institution.id;
    createdInstitutionIds.push(institution.id);

    const existingAmatycAdmin = await prisma.user.findUnique({
      where: { email: AMATYC_ADMIN_EMAIL },
    });
    if (existingAmatycAdmin) {
      await prisma.user.update({
        where: { id: existingAmatycAdmin.id },
        data: {
          privacyConsentAcceptedAt: new Date(),
          privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
        },
      });
      amatycAdminId = existingAmatycAdmin.id;
    } else {
      const amatycAdmin = await createConsentedUser({
        googleId: `amatyc-admin-google-${stamp}`,
        name: 'AMATYC Admin',
        email: AMATYC_ADMIN_EMAIL,
        role: 'PROJECT_LEAD',
      });
      amatycAdminId = amatycAdmin.id;
    }

    const regularUser = await createConsentedUser({
      googleId: `amatyc-admin-regular-${stamp}`,
      name: 'Regular User',
      email: `regular-${stamp}@example.com`,
      role: 'USER',
    });
    regularUserId = regularUser.id;

    const facultyUser = await createConsentedUser({
      googleId: `amatyc-admin-faculty-${stamp}`,
      name: 'Member User',
      email: `faculty-${stamp}@example.com`,
      role: 'USER',
      institutionId,
    });
    facultyUserId = facultyUser.id;

    const rubric = await prisma.rubric.create({
      data: {
        title: `amatyc-admin-rubric-${stamp}`,
        description: 'test',
        active: true,
      },
    });
    createdRubricIds.push(rubric.id);

    const rubricVersion = await prisma.rubricVersion.create({
      data: {
        rubricId: rubric.id,
        versionNum: 1,
      },
    });
    rubricVersionId = rubricVersion.id;

    const scale = await prisma.scale.create({
      data: {
        rubricId: rubric.id,
        prompt: 'Scale prompt',
        orderIndex: 0,
      },
    });

    const scaleVersion = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersion.id,
        originalScaleId: scale.id,
        prompt: 'Scale prompt',
        orderIndex: 0,
        isGlobal: false,
        editable: true,
      },
    });
    scaleVersionId = scaleVersion.id;

    const response = await prisma.response.create({
      data: {
        userId: facultyUserId,
        scaleVersionId,
        rubricVersionId,
        pathwayId: GENERAL_PATHWAY_ID,
        score: 3,
        status: 'SUBMITTED',
      },
    });
    createdResponseIds.push(response.id);

    await prisma.userRubricAssignment.create({
      data: {
        userId: facultyUserId,
        rubricVersionId,
        pathwayId: GENERAL_PATHWAY_ID,
        status: 'ASSIGNED',
      },
    });

    const invitation = await prisma.invitation.create({
      data: {
        email: `invitee-${stamp}@example.com`,
        institutionId,
        role: 'USER',
        token: `token-${stamp}`,
        invitedById: facultyUserId,
      },
    });
    createdInvitationIds.push(invitation.id);
  });

  afterAll(async () => {
    await prisma.response.deleteMany({
      where: {
        OR: [{ id: { in: createdResponseIds } }, { userId: { in: createdUserIds } }],
      },
    });
    await prisma.consensusResponse.deleteMany({
      where: { userId: { in: createdUserIds } },
    });
    await prisma.userRubricAssignment.deleteMany({
      where: { userId: { in: createdUserIds } },
    });
    await prisma.invitation.deleteMany({
      where: {
        OR: [
          { id: { in: createdInvitationIds } },
          { institutionId: { in: createdInstitutionIds } },
          { invitedById: { in: createdUserIds } },
        ],
      },
    });
    await prisma.scaleVersion.deleteMany({
      where: { rubricVersion: { rubricId: { in: createdRubricIds } } },
    });
    await prisma.scale.deleteMany({
      where: { rubricId: { in: createdRubricIds } },
    });
    await prisma.userRubricAssignment.deleteMany({
      where: { rubricVersion: { rubricId: { in: createdRubricIds } } },
    });
    await prisma.rubricVersion.deleteMany({
      where: { rubricId: { in: createdRubricIds } },
    });
    await prisma.rubric.deleteMany({
      where: { id: { in: createdRubricIds } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: createdUserIds } },
    });
    await prisma.institution.deleteMany({
      where: { id: { in: createdInstitutionIds } },
    });
  });

  test('rejects unauthenticated access', async () => {
    const response = await request(app).get('/api/amatyc-admin/users');
    expect(response.status).toBe(401);
  });

  test('rejects non-AMATYC-admin email even if project lead', async () => {
    const agent = await loginAs(regularUserId);
    const response = await agent.get('/api/amatyc-admin/users');
    expect(response.status).toBe(403);
  });

  test('lists users for AMATYC admin email', async () => {
    const agent = await loginAs(amatycAdminId);
    const response = await agent.get('/api/amatyc-admin/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const ids = new Set((response.body as { id: string }[]).map((row) => row.id));
    expect(ids.has(facultyUserId)).toBe(true);
    expect(ids.has(amatycAdminId)).toBe(true);
  });

  test('returns user deletion impact with cascade warnings', async () => {
    const agent = await loginAs(amatycAdminId);
    const response = await agent.get(`/api/amatyc-admin/users/${facultyUserId}/deletion-impact`);
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(facultyUserId);
    expect(response.body.responseCount).toBeGreaterThanOrEqual(1);
    expect(response.body.rubricAssignmentCount).toBeGreaterThanOrEqual(1);
    expect(response.body.invitationAuthoredCount).toBeGreaterThanOrEqual(1);
    expect(response.body.warnings.length).toBeGreaterThan(0);
    expect(response.body.confirmationPhrase).toContain('@');
  });

  test('blocks self-delete', async () => {
    const agent = await loginAs(amatycAdminId);
    const response = await agent.delete(`/api/amatyc-admin/users/${amatycAdminId}`).send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/own account/i);
  });

  test('deletes a user and cascades linked data while clearing invitation authorship', async () => {
    const stamp = randomUUID();
    const target = await createConsentedUser({
      googleId: `amatyc-delete-target-${stamp}`,
      name: 'Delete Target',
      email: `delete-target-${stamp}@example.com`,
      role: 'USER',
      institutionId,
    });

    await prisma.response.create({
      data: {
        userId: target.id,
        scaleVersionId,
        rubricVersionId,
        pathwayId: GENERAL_PATHWAY_ID,
        score: 2,
        status: 'DRAFT',
      },
    });
    await prisma.userRubricAssignment.create({
      data: {
        userId: target.id,
        rubricVersionId,
        pathwayId: GENERAL_PATHWAY_ID,
        status: 'ASSIGNED',
      },
    });
    const authoredInvite = await prisma.invitation.create({
      data: {
        email: `kept-invite-${stamp}@example.com`,
        institutionId,
        role: 'USER',
        token: `kept-token-${stamp}`,
        invitedById: target.id,
      },
    });
    createdInvitationIds.push(authoredInvite.id);

    const agent = await loginAs(amatycAdminId);
    const deleteResponse = await agent.delete(`/api/amatyc-admin/users/${target.id}`).send({});
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ status: 'ok' });

    const deletedUser = await prisma.user.findUnique({ where: { id: target.id } });
    expect(deletedUser).toBeNull();

    const leftoverResponses = await prisma.response.count({ where: { userId: target.id } });
    expect(leftoverResponses).toBe(0);

    const leftoverAssignments = await prisma.userRubricAssignment.count({
      where: { userId: target.id },
    });
    expect(leftoverAssignments).toBe(0);

    const inviteAfter = await prisma.invitation.findUnique({ where: { id: authoredInvite.id } });
    expect(inviteAfter).not.toBeNull();
    expect(inviteAfter?.invitedById).toBeNull();
  });

  test('requires typed confirmation for local leader delete', async () => {
    const stamp = randomUUID();
    const leader = await createConsentedUser({
      googleId: `amatyc-leader-${stamp}`,
      name: 'Local Leader Target',
      email: `leader-${stamp}@example.com`,
      role: 'LOCAL_LEADER',
      institutionId,
    });

    const agent = await loginAs(amatycAdminId);
    const impactResponse = await agent.get(`/api/amatyc-admin/users/${leader.id}/deletion-impact`);
    expect(impactResponse.status).toBe(200);
    expect(impactResponse.body.requiresTypedConfirmation).toBe(true);

    const rejected = await agent.delete(`/api/amatyc-admin/users/${leader.id}`).send({
      confirmationPhrase: 'wrong',
    });
    expect(rejected.status).toBe(400);

    const accepted = await agent.delete(`/api/amatyc-admin/users/${leader.id}`).send({
      confirmationPhrase: leader.email,
    });
    expect(accepted.status).toBe(200);
    expect(await prisma.user.findUnique({ where: { id: leader.id } })).toBeNull();
  });

  test('lists institutions and returns institution deletion impact', async () => {
    const agent = await loginAs(amatycAdminId);
    const listResponse = await agent.get('/api/amatyc-admin/institutions');
    expect(listResponse.status).toBe(200);
    const ids = new Set((listResponse.body as { id: string }[]).map((row) => row.id));
    expect(ids.has(institutionId)).toBe(true);

    const impactResponse = await agent.get(
      `/api/amatyc-admin/institutions/${institutionId}/deletion-impact`
    );
    expect(impactResponse.status).toBe(200);
    expect(impactResponse.body.institutionId).toBe(institutionId);
    expect(impactResponse.body.usersDetachedNotDeleted).toBe(true);
    expect(impactResponse.body.warnings.some((warning: string) => /detached/i.test(warning))).toBe(
      true
    );
  });

  test('deletes institution after typed confirmation and detaches users', async () => {
    const stamp = randomUUID();
    const institution = await prisma.institution.create({
      data: {
        name: `amatyc-delete-inst-${stamp}`,
        academicSchoolYear: '25/26',
      },
    });
    createdInstitutionIds.push(institution.id);

    const member = await createConsentedUser({
      googleId: `amatyc-inst-member-${stamp}`,
      name: 'Institution Member',
      email: `inst-member-${stamp}@example.com`,
      role: 'USER',
      institutionId: institution.id,
    });

    const agent = await loginAs(amatycAdminId);
    const impact = await agent.get(
      `/api/amatyc-admin/institutions/${institution.id}/deletion-impact`
    );
    expect(impact.status).toBe(200);

    const rejected = await agent.delete(`/api/amatyc-admin/institutions/${institution.id}`).send({
      confirmationPhrase: 'not-the-name',
    });
    if (impact.body.requiresTypedConfirmation) {
      expect(rejected.status).toBe(400);
      const deleted = await agent.delete(`/api/amatyc-admin/institutions/${institution.id}`).send({
        confirmationPhrase: institution.name,
      });
      expect(deleted.status).toBe(200);
      expect(deleted.body).toEqual({ status: 'ok' });
    } else {
      expect(rejected.status).toBe(200);
      expect(rejected.body).toEqual({ status: 'ok' });
    }

    expect(await prisma.institution.findUnique({ where: { id: institution.id } })).toBeNull();
    const memberAfter = await prisma.user.findUnique({ where: { id: member.id } });
    expect(memberAfter).not.toBeNull();
    expect(memberAfter?.institutionId).toBeNull();
  });
});
