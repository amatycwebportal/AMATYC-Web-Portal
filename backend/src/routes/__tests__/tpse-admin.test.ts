import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { prisma } from '@lib/prisma';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { TPSE_ADMIN_EMAIL } from '@shared/tpseAdmin';
import app from '../../app';

describe('tpse-admin routes', () => {
  const createdUserIds: string[] = [];
  const createdInstitutionIds: string[] = [];
  const createdInvitationIds: string[] = [];
  const createdResponseIds: string[] = [];
  const createdRubricIds: string[] = [];

  let tpseAdminId = '';
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
    role: 'PROJECT_LEAD' | 'LOCAL_LEADER' | 'FACULTY' | 'USER';
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
        name: `tpse-admin-inst-${stamp}`,
        academicSchoolYear: '25/26',
      },
    });
    institutionId = institution.id;
    createdInstitutionIds.push(institution.id);

    const existingTpseAdmin = await prisma.user.findUnique({
      where: { email: TPSE_ADMIN_EMAIL },
    });
    if (existingTpseAdmin) {
      await prisma.user.update({
        where: { id: existingTpseAdmin.id },
        data: {
          privacyConsentAcceptedAt: new Date(),
          privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
        },
      });
      tpseAdminId = existingTpseAdmin.id;
    } else {
      const tpseAdmin = await createConsentedUser({
        googleId: `tpse-admin-google-${stamp}`,
        name: 'TPSE Admin',
        email: TPSE_ADMIN_EMAIL,
        role: 'PROJECT_LEAD',
      });
      tpseAdminId = tpseAdmin.id;
    }

    const regularUser = await createConsentedUser({
      googleId: `tpse-admin-regular-${stamp}`,
      name: 'Regular User',
      email: `regular-${stamp}@example.com`,
      role: 'USER',
    });
    regularUserId = regularUser.id;

    const facultyUser = await createConsentedUser({
      googleId: `tpse-admin-faculty-${stamp}`,
      name: 'Faculty User',
      email: `faculty-${stamp}@example.com`,
      role: 'FACULTY',
      institutionId,
    });
    facultyUserId = facultyUser.id;

    const rubric = await prisma.rubric.create({
      data: {
        title: `tpse-admin-rubric-${stamp}`,
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
        score: 3,
        status: 'SUBMITTED',
      },
    });
    createdResponseIds.push(response.id);

    await prisma.userRubricAssignment.create({
      data: {
        userId: facultyUserId,
        rubricVersionId,
        status: 'ASSIGNED',
      },
    });

    const invitation = await prisma.invitation.create({
      data: {
        email: `invitee-${stamp}@example.com`,
        institutionId,
        role: 'FACULTY',
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
    await prisma.userCourseBin.deleteMany({
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
    await prisma.course.deleteMany({
      where: { courseBin: { institutionId: { in: createdInstitutionIds } } },
    });
    await prisma.courseBin.deleteMany({
      where: { institutionId: { in: createdInstitutionIds } },
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
    const response = await request(app).get('/api/tpse-admin/users');
    expect(response.status).toBe(401);
  });

  test('rejects non-TPSE-admin email even if project lead', async () => {
    const agent = await loginAs(regularUserId);
    const response = await agent.get('/api/tpse-admin/users');
    expect(response.status).toBe(403);
  });

  test('lists users for TPSE admin email', async () => {
    const agent = await loginAs(tpseAdminId);
    const response = await agent.get('/api/tpse-admin/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const ids = new Set((response.body as { id: string }[]).map((row) => row.id));
    expect(ids.has(facultyUserId)).toBe(true);
    expect(ids.has(tpseAdminId)).toBe(true);
  });

  test('returns user deletion impact with cascade warnings', async () => {
    const agent = await loginAs(tpseAdminId);
    const response = await agent.get(`/api/tpse-admin/users/${facultyUserId}/deletion-impact`);
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(facultyUserId);
    expect(response.body.responseCount).toBeGreaterThanOrEqual(1);
    expect(response.body.rubricAssignmentCount).toBeGreaterThanOrEqual(1);
    expect(response.body.invitationAuthoredCount).toBeGreaterThanOrEqual(1);
    expect(response.body.warnings.length).toBeGreaterThan(0);
    expect(response.body.confirmationPhrase).toContain('@');
  });

  test('blocks self-delete', async () => {
    const agent = await loginAs(tpseAdminId);
    const response = await agent.delete(`/api/tpse-admin/users/${tpseAdminId}`).send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/own account/i);
  });

  test('deletes a user and cascades linked data while clearing invitation authorship', async () => {
    const stamp = randomUUID();
    const target = await createConsentedUser({
      googleId: `tpse-delete-target-${stamp}`,
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
        score: 2,
        status: 'DRAFT',
      },
    });
    await prisma.userRubricAssignment.create({
      data: {
        userId: target.id,
        rubricVersionId,
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

    const agent = await loginAs(tpseAdminId);
    const deleteResponse = await agent.delete(`/api/tpse-admin/users/${target.id}`).send({});
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
      googleId: `tpse-leader-${stamp}`,
      name: 'Local Leader Target',
      email: `leader-${stamp}@example.com`,
      role: 'LOCAL_LEADER',
      institutionId,
    });

    const agent = await loginAs(tpseAdminId);
    const impactResponse = await agent.get(`/api/tpse-admin/users/${leader.id}/deletion-impact`);
    expect(impactResponse.status).toBe(200);
    expect(impactResponse.body.requiresTypedConfirmation).toBe(true);

    const rejected = await agent.delete(`/api/tpse-admin/users/${leader.id}`).send({
      confirmationPhrase: 'wrong',
    });
    expect(rejected.status).toBe(400);

    const accepted = await agent.delete(`/api/tpse-admin/users/${leader.id}`).send({
      confirmationPhrase: leader.email,
    });
    expect(accepted.status).toBe(200);
    expect(await prisma.user.findUnique({ where: { id: leader.id } })).toBeNull();
  });

  test('lists institutions and returns institution deletion impact', async () => {
    const agent = await loginAs(tpseAdminId);
    const listResponse = await agent.get('/api/tpse-admin/institutions');
    expect(listResponse.status).toBe(200);
    const ids = new Set((listResponse.body as { id: string }[]).map((row) => row.id));
    expect(ids.has(institutionId)).toBe(true);

    const impactResponse = await agent.get(
      `/api/tpse-admin/institutions/${institutionId}/deletion-impact`
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
        name: `tpse-delete-inst-${stamp}`,
        academicSchoolYear: '25/26',
      },
    });
    createdInstitutionIds.push(institution.id);

    const member = await createConsentedUser({
      googleId: `tpse-inst-member-${stamp}`,
      name: 'Institution Member',
      email: `inst-member-${stamp}@example.com`,
      role: 'FACULTY',
      institutionId: institution.id,
    });

    const agent = await loginAs(tpseAdminId);
    const impact = await agent.get(
      `/api/tpse-admin/institutions/${institution.id}/deletion-impact`
    );
    expect(impact.status).toBe(200);

    const rejected = await agent.delete(`/api/tpse-admin/institutions/${institution.id}`).send({
      confirmationPhrase: 'not-the-name',
    });
    if (impact.body.requiresTypedConfirmation) {
      expect(rejected.status).toBe(400);
    }

    const deleted = await agent.delete(`/api/tpse-admin/institutions/${institution.id}`).send({
      confirmationPhrase: institution.name,
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body).toEqual({ status: 'ok' });

    expect(await prisma.institution.findUnique({ where: { id: institution.id } })).toBeNull();
    const memberAfter = await prisma.user.findUnique({ where: { id: member.id } });
    expect(memberAfter).not.toBeNull();
    expect(memberAfter?.institutionId).toBeNull();
  });
});
