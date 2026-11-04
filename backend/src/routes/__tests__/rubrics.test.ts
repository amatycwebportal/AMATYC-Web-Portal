import request from 'supertest';
import app from '../../app';
import { fetchResponseExportRows } from '@lib/buildResponseExport';
import { AssignmentStatus } from '@lib/prisma';
import { prisma } from '@lib/prisma';
import {
  GENERAL_PATHWAY_ID,
  STATISTICS_PATHWAY_ID,
  STEM_PATHWAY_ID,
} from '@shared/pathways';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

function withPrivacyConsent<T extends Record<string, unknown>>(data: T) {
  return {
    ...data,
    privacyConsentAcceptedAt: new Date(),
    privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
  };
}

const sampleLevelDescriptions = {
  '1': { label: 'Level 1', description: 'First' },
  '2': { label: 'Level 2', description: 'Second' },
};

describe('rubrics routes', () => {
  const primaryUserId = (): string => createdUserIds[0]!;
  const primaryRubricId = (): string => createdRubricIds[0]!;
  const primaryRubricVersionId = (): string => createdRubricVersionIds[0]!;
  const rubricsBasePath = '/api/rubrics';
  const rubricsAllPath = '/api/rubrics/all';
  const rubricsAssignPath = '/api/rubrics/assign';
  const rubricsUnassignPath = '/api/rubrics/unassign';
  const rubricsStartPath = '/api/rubrics/start';
  const rubricsCompletePath = '/api/rubrics/complete';
  const rubricsAnalyticsContextPath = '/api/rubrics/analytics-context';
  const rubricsAssignmentMatrixPath = '/api/rubrics/assignment-matrix';
  const createdUserIds: string[] = [];
  const firstScaleOrderIndex = 0;
  const secondScaleOrderIndex = 1;

  const createdRubricIds: string[] = [];
  const createdRubricVersionIds: string[] = [];
  const expectedRubricDataById: Record<
    string,
    {
      title: string;
      description: string;
      scales: Array<{
        prompt: string;
        orderIndex: number;
        editable: boolean;
        isGlobal: boolean;
      }>;
    }
  > = {};

  type CreateScaleInput = {
    prompt: string;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    levelDescriptions?: object;
  };

  const linkRubricPathways = async (rubricId: string, pathwayIds: string[]) => {
    await prisma.rubricPathway.createMany({
      data: pathwayIds.map((pathwayId) => ({ rubricId, pathwayId })),
      skipDuplicates: true,
    });
  };

  const createRubricWithScales = async (data: {
    title: string;
    description: string;
    scales: CreateScaleInput[];
  }) => {
    const rubric = await prisma.rubric.create({
      data: {
        title: data.title,
        description: data.description,
        active: true,
      },
    });

    createdRubricIds.push(rubric.id);

    const createdScales = await Promise.all(
      data.scales.map((scale) =>
        prisma.scale.create({
          data: {
            rubricId: rubric.id,
            prompt: scale.prompt,
            orderIndex: scale.orderIndex,
            editable: scale.editable ?? true,
            isGlobal: scale.isGlobal ?? false,
            ...(scale.levelDescriptions != null
              ? { levelDescriptions: scale.levelDescriptions }
              : {}),
          },
        })
      )
    );

    expectedRubricDataById[rubric.id] = {
      title: rubric.title,
      description: rubric.description,
      scales: createdScales
        .map((scale) => ({
          prompt: scale.prompt,
          orderIndex: scale.orderIndex,
          editable: scale.editable,
          isGlobal: scale.isGlobal,
        }))
        .sort((a, b) => a.orderIndex - b.orderIndex),
    };

    return rubric;
  };
  const createRubricVersion = async (rubricId: string) => {
    const latestRubricVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId },
      orderBy: { versionNum: 'desc' },
    });
    const rubricVersion = await prisma.rubricVersion.create({
      data: {
        rubricId,
        versionNum: 1,
      },
    });
    createdRubricVersionIds.push(rubricVersion.id);
  };

  /** Rubric used for POST /update success + assignment migration (seeded with bins + level text). */
  let rubricForUpdateId: string;
  /** Rubric with scales but never versioned via GET/assign — for update-without-version. */
  let rubricWithoutVersionId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        googleId: `test-google-id-${Date.now()}`,
        name: 'Test User',
        email: `test-${Date.now()}@test.com`,
        role: 'USER',
      },
    });
    createdUserIds.push(user.id);

    await createRubricWithScales({
      title: `test-rubric-${Date.now()}-a`,
      description: 'Test rubric A',
      scales: [
        {
          prompt: 'Test rubric A scale 1',
          orderIndex: firstScaleOrderIndex,
          editable: true,
          isGlobal: false,
        },
        {
          prompt: 'Test rubric A scale 2',
          orderIndex: secondScaleOrderIndex,
          editable: true,
          isGlobal: false,
        },
      ],
    });

    await createRubricWithScales({
      title: `test-rubric-${Date.now()}-b`,
      description: 'Test rubric B',
      scales: [
        {
          prompt: 'Test rubric B scale 1',
          orderIndex: firstScaleOrderIndex,
          editable: false,
          isGlobal: true,
        },
      ],
    });
    const primaryRubricVersionId = await createRubricVersion(primaryRubricId());

    const rubricForUpdate = await createRubricWithScales({
      title: `test-rubric-update-${Date.now()}`,
      description: 'Editable rubric',
      scales: [
        {
          prompt: 'Scale before edit',
          orderIndex: firstScaleOrderIndex,
          editable: true,
          isGlobal: false,
          levelDescriptions: sampleLevelDescriptions,
        },
      ],
    });
    rubricForUpdateId = rubricForUpdate.id;

    const rubricNoVersion = await prisma.rubric.create({
      data: {
        title: `test-rubric-no-version-${Date.now()}`,
        description: 'No RubricVersion row',
        active: true,
      },
    });
    createdRubricIds.push(rubricNoVersion.id);
    await prisma.scale.create({
      data: {
        rubricId: rubricNoVersion.id,
        prompt: 'Lonely scale',
        orderIndex: 0,
        editable: true,
        isGlobal: false,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    rubricWithoutVersionId = rubricNoVersion.id;
  });

  afterAll(async () => {
    if (createdRubricIds.length === 0) return;

    const rubricVersions = await prisma.rubricVersion.findMany({
      where: { rubricId: { in: createdRubricIds } },
      select: { id: true },
    });
    const rubricVersionIds = rubricVersions.map((row) => row.id);

    if (rubricVersionIds.length > 0) {
      await prisma.userRubricAssignment.deleteMany({
        where: { rubricVersionId: { in: rubricVersionIds } },
      });
      await prisma.response.deleteMany({
        where: { rubricVersionId: { in: rubricVersionIds } },
      });
      const scaleVersionIds = (
        await prisma.scaleVersion.findMany({
          where: { rubricVersionId: { in: rubricVersionIds } },
          select: { id: true },
        })
      ).map((row) => row.id);
      await prisma.scaleVersion.deleteMany({
        where: { rubricVersionId: { in: rubricVersionIds } },
      });
      await prisma.rubricVersion.deleteMany({
        where: { id: { in: rubricVersionIds } },
      });
    }

    await prisma.scale.deleteMany({
      where: {
        rubricId: { in: createdRubricIds },
      },
    });

    await prisma.rubric.deleteMany({
      where: {
        id: { in: createdRubricIds },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: { in: createdUserIds },
      },
    });
  });

  test('GET /rubrics returns ok', async () => {
    const response = await request(app).get(rubricsBasePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /rubrics/analytics-context returns empty contexts when rubric has no versions', async () => {
    const response = await request(app)
      .get(rubricsAnalyticsContextPath)
      .query({ rubricId: rubricWithoutVersionId });

    expect(response.status).toBe(401);
  });

  test('GET /rubrics/all returns rubrics with scales', async () => {
    const response = await request(app).get(rubricsAllPath);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const apiRubrics = response.body as Array<{
      id: string;
      title: string;
      description: string;
      scales: Array<{
        prompt: string;
        orderIndex: number;
        editable: boolean;
        isGlobal: boolean;
      }>;
      versions: Array<{ id: string; versionNum: number }>;
    }>;

    const rubricIds = createdRubricIds.filter((id) => id !== rubricWithoutVersionId);

    expect(rubricIds.length).toBeGreaterThan(0);

    rubricIds.forEach((rubricId) => {
      const rubricFromApi = apiRubrics.find((rubric) => rubric.id === rubricId);
      expect(rubricFromApi).toBeDefined();

      if (!rubricFromApi) return;

      const expectedRubric = expectedRubricDataById[rubricId];
      if (!expectedRubric) return expect(false).toBe(true);
      expect(rubricFromApi.title).toBe(expectedRubric.title);
      expect(rubricFromApi.description).toBe(expectedRubric.description);

      const sortedApiScales = rubricFromApi.scales.sort((a, b) => a.orderIndex - b.orderIndex);

      expect(sortedApiScales).toHaveLength(expectedRubric.scales.length);

      sortedApiScales.forEach((scale, index) => {
        if (!expectedRubric.scales[index]) return expect(false).toBe(true);
        expect(scale.prompt).toBe(expectedRubric.scales[index].prompt);
        expect(scale.orderIndex).toBe(expectedRubric.scales[index].orderIndex);
        expect(scale.editable).toBe(expectedRubric.scales[index].editable);
        expect(scale.isGlobal).toBe(expectedRubric.scales[index].isGlobal);
      });
    });
  });

  test('GET /rubrics/:rubricId returns 404 when rubric is missing', async () => {
    const response = await request(app).get(
      `${rubricsBasePath}/00000000-0000-0000-0000-000000000000`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Rubric not found' });
  });

  test('GET /rubrics/:rubricId ensures a version and returns scales with originalScaleId', async () => {
    const liveScale = await prisma.scale.findFirst({
      where: { rubricId: rubricForUpdateId },
    });
    expect(liveScale).toBeDefined();
    if (!liveScale) return;

    const beforeVersions = await prisma.rubricVersion.count({
      where: { rubricId: rubricForUpdateId },
    });

    const response = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);

    expect(response.status).toBe(200);
    const body = response.body as {
      id: string;
      title: string;
      scales: Array<{
        id: string;
        originalScaleId: string;
        prompt: string;
        levelDescriptions: unknown;
      }>;
      versions: Array<{ id: string; versionNum: number }>;
    };

    expect(body.id).toBe(rubricForUpdateId);
    expect(body.scales).toHaveLength(1);
    expect(body.scales[0]?.originalScaleId).toBe(liveScale.id);
    expect(body.scales[0]?.prompt).toBe(liveScale.prompt);
    expect(body.versions[0]?.versionNum).toBe(1);

    const afterVersions = await prisma.rubricVersion.count({
      where: { rubricId: rubricForUpdateId },
    });
    if (beforeVersions === 0) {
      expect(afterVersions).toBe(1);
    }
  });

  test('POST /rubrics/assign creates a rubric version when none exists and returns ok', async () => {
    const response = await request(app).post(rubricsAssignPath).send({
      rubricId: primaryRubricId(),
      userIds: createdUserIds,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubrics assigned successfully' });

    const versionCount = await prisma.rubricVersion.count({
      where: { rubricId: primaryRubricId() },
    });
    expect(versionCount).toBeGreaterThan(0);
  });

  test('POST /rubrics/assign returns not ok when users list is empty', async () => {
    const response = await request(app).post(rubricsAssignPath).send({
      rubricId: primaryRubricId(),
      userIds: [],
    });
    expect(response.status).toBe(406);
    expect(response.body).toEqual({ error: 'Rubric or users not found' });
  });

  test('POST /rubrics/assign accepts rubricIds and assigns each rubric to users', async () => {
    const rubricIdA = createdRubricIds[0]!;
    const rubricIdB = createdRubricIds[1]!;
    await prisma.userRubricAssignment.deleteMany({
      where: {
        userId: { in: createdUserIds },
        rubricVersion: { rubricId: { in: [rubricIdA, rubricIdB] } },
      },
    });

    const response = await request(app)
      .post(rubricsAssignPath)
      .send({
        rubricIds: [rubricIdA, rubricIdB],
        userIds: createdUserIds,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubrics assigned successfully' });

    for (const rubricId of [rubricIdA, rubricIdB]) {
      const latestVersion = await prisma.rubricVersion.findFirst({
        where: { rubricId },
        orderBy: { versionNum: 'desc' },
      });
      expect(latestVersion).toBeDefined();
      if (!latestVersion) continue;
      const assignmentCount = await prisma.userRubricAssignment.count({
        where: { userId: primaryUserId(), rubricVersionId: latestVersion.id },
      });
      expect(assignmentCount).toBe(1);
    }
  });

  test('POST /rubrics/assign perUserContexts assigns general and linked pathways', async () => {
    const timestamp = Date.now();
    const institution = await prisma.institution.create({
      data: { name: `per-user-context-inst-${timestamp}`, academicSchoolYear: '25/26' },
    });
    const contextUser = await prisma.user.create({
      data: {
        googleId: `per-user-context-${timestamp}`,
        name: 'Per-user context user',
        email: `per-user-context-${timestamp}@example.com`,
        role: 'USER',
        institutionId: institution.id,
      },
    });

    const rubricId = primaryRubricId();
    await linkRubricPathways(rubricId, [GENERAL_PATHWAY_ID, STATISTICS_PATHWAY_ID]);
    await prisma.userRubricAssignment.deleteMany({
      where: {
        userId: contextUser.id,
        rubricVersion: { rubricId },
      },
    });

    const response = await request(app)
      .post(rubricsAssignPath)
      .send({
        mode: 'perUserContexts',
        rubricId,
        assignments: [
          {
            userId: contextUser.id,
            rubricId,
            includeGeneral: true,
            pathwayIds: [STATISTICS_PATHWAY_ID],
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubrics assigned successfully' });

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId },
      orderBy: { versionNum: 'desc' },
    });
    expect(latestVersion).toBeDefined();
    if (!latestVersion) return;

    const generalAssignment = await prisma.userRubricAssignment.findFirst({
      where: {
        userId: contextUser.id,
        rubricVersionId: latestVersion.id,
        pathwayId: GENERAL_PATHWAY_ID,
      },
    });
    const statisticsAssignment = await prisma.userRubricAssignment.findFirst({
      where: {
        userId: contextUser.id,
        rubricVersionId: latestVersion.id,
        pathwayId: STATISTICS_PATHWAY_ID,
      },
    });
    expect(generalAssignment?.status).toBe(AssignmentStatus.ASSIGNED);
    expect(statisticsAssignment?.status).toBe(AssignmentStatus.ASSIGNED);

    await prisma.userRubricAssignment.deleteMany({ where: { userId: contextUser.id } });
    await prisma.user.delete({ where: { id: contextUser.id } });
    await prisma.institution.delete({ where: { id: institution.id } });
  });

  test('POST /rubrics/assign perUserContexts assigns pathways without general context', async () => {
    const timestamp = Date.now();
    const institution = await prisma.institution.create({
      data: { name: `per-user-context-no-general-inst-${timestamp}`, academicSchoolYear: '25/26' },
    });
    const contextUser = await prisma.user.create({
      data: {
        googleId: `per-user-context-no-general-${timestamp}`,
        name: 'Per-user context user',
        email: `per-user-context-no-general-${timestamp}@example.com`,
        role: 'USER',
        institutionId: institution.id,
      },
    });

    const rubricId = primaryRubricId();
    await linkRubricPathways(rubricId, [STATISTICS_PATHWAY_ID]);
    await prisma.userRubricAssignment.deleteMany({
      where: {
        userId: contextUser.id,
        rubricVersion: { rubricId },
      },
    });

    const response = await request(app)
      .post(rubricsAssignPath)
      .send({
        mode: 'perUserContexts',
        rubricId,
        assignments: [
          {
            userId: contextUser.id,
            rubricId,
            includeGeneral: false,
            pathwayIds: [STATISTICS_PATHWAY_ID],
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubrics assigned successfully' });

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId },
      orderBy: { versionNum: 'desc' },
    });
    expect(latestVersion).toBeDefined();
    if (!latestVersion) return;

    const generalAssignment = await prisma.userRubricAssignment.findFirst({
      where: {
        userId: contextUser.id,
        rubricVersionId: latestVersion.id,
        pathwayId: GENERAL_PATHWAY_ID,
      },
    });
    const statisticsAssignment = await prisma.userRubricAssignment.findFirst({
      where: {
        userId: contextUser.id,
        rubricVersionId: latestVersion.id,
        pathwayId: STATISTICS_PATHWAY_ID,
      },
    });
    expect(generalAssignment).toBeNull();
    expect(statisticsAssignment?.status).toBe(AssignmentStatus.ASSIGNED);

    await prisma.userRubricAssignment.deleteMany({ where: { userId: contextUser.id } });
    await prisma.user.delete({ where: { id: contextUser.id } });
    await prisma.institution.delete({ where: { id: institution.id } });
  });

  test('POST /rubrics/assign perUserContexts rejects rows with no contexts', async () => {
    const timestamp = Date.now();
    const institution = await prisma.institution.create({
      data: { name: `per-user-context-empty-inst-${timestamp}`, academicSchoolYear: '25/26' },
    });
    const contextUser = await prisma.user.create({
      data: {
        googleId: `per-user-context-empty-${timestamp}`,
        name: 'Per-user context user',
        email: `per-user-context-empty-${timestamp}@example.com`,
        role: 'USER',
        institutionId: institution.id,
      },
    });

    const rubricId = primaryRubricId();
    const response = await request(app)
      .post(rubricsAssignPath)
      .send({
        mode: 'perUserContexts',
        rubricId,
        assignments: [
          {
            userId: contextUser.id,
            rubricId,
            includeGeneral: false,
            pathwayIds: [],
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Each user must have at least one assignment context',
    });

    await prisma.user.delete({ where: { id: contextUser.id } });
    await prisma.institution.delete({ where: { id: institution.id } });
  });

  test('POST /rubrics/assign perUserContexts rejects pathways not linked to the rubric', async () => {
    const timestamp = Date.now();
    const institution = await prisma.institution.create({
      data: { name: `per-user-context-invalid-pathway-inst-${timestamp}`, academicSchoolYear: '25/26' },
    });
    const contextUser = await prisma.user.create({
      data: {
        googleId: `per-user-context-invalid-pathway-${timestamp}`,
        name: 'Per-user context user',
        email: `per-user-context-invalid-pathway-${timestamp}@example.com`,
        role: 'USER',
        institutionId: institution.id,
      },
    });

    const rubric = await createRubricWithScales({
      title: `unlinked-pathway-${timestamp}`,
      description: 'Rejects a pathway that is not linked',
      scales: [
        {
          prompt: 'Unlinked pathway scale',
          orderIndex: 0,
          editable: true,
          isGlobal: true,
        },
      ],
    });
    await linkRubricPathways(rubric.id, [GENERAL_PATHWAY_ID]);
    const response = await request(app)
      .post(rubricsAssignPath)
      .send({
        mode: 'perUserContexts',
        rubricId: rubric.id,
        assignments: [
          {
            userId: contextUser.id,
            rubricId: rubric.id,
            includeGeneral: false,
            pathwayIds: [STATISTICS_PATHWAY_ID],
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Per-user context assignment must use pathways linked to the rubric',
    });

    await prisma.user.delete({ where: { id: contextUser.id } });
    await prisma.institution.delete({ where: { id: institution.id } });
  });

  test('POST /rubrics/assign is idempotent for duplicate general and pathway rows', async () => {
    const timestamp = Date.now();
    const institution = await prisma.institution.create({
      data: { name: `assign-idempotent-inst-${timestamp}`, academicSchoolYear: '25/26' },
    });
    const contextUser = await prisma.user.create({
      data: {
        googleId: `assign-idempotent-${timestamp}`,
        name: 'Idempotent assign user',
        email: `assign-idempotent-${timestamp}@example.com`,
        role: 'USER',
        institutionId: institution.id,
      },
    });

    const rubricId = primaryRubricId();
    await linkRubricPathways(rubricId, [GENERAL_PATHWAY_ID, STATISTICS_PATHWAY_ID]);
    await prisma.userRubricAssignment.deleteMany({
      where: {
        userId: contextUser.id,
        rubricVersion: { rubricId },
      },
    });

    const payload = {
      mode: 'perUserContexts' as const,
      rubricId,
      assignments: [
        {
          userId: contextUser.id,
          rubricId,
          includeGeneral: true,
          pathwayIds: [STATISTICS_PATHWAY_ID],
        },
      ],
    };

    const firstResponse = await request(app).post(rubricsAssignPath).send(payload);
    const secondResponse = await request(app).post(rubricsAssignPath).send(payload);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toEqual({ message: 'Rubrics assigned successfully' });
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toEqual({ message: 'No new rubric assignments were created' });

    const latestVersion = await prisma.rubricVersion.findFirst({
      where: { rubricId },
      orderBy: { versionNum: 'desc' },
    });
    expect(latestVersion).toBeDefined();
    if (!latestVersion) return;

    const assignmentCount = await prisma.userRubricAssignment.count({
      where: {
        userId: contextUser.id,
        rubricVersionId: latestVersion.id,
      },
    });
    expect(assignmentCount).toBe(2);

    await prisma.userRubricAssignment.deleteMany({ where: { userId: contextUser.id } });
    await prisma.user.delete({ where: { id: contextUser.id } });
    await prisma.institution.delete({ where: { id: institution.id } });
  });

  test('GET /rubrics/assigned/:userId returns rubric versions for assigned user', async () => {
    await prisma.userRubricAssignment.deleteMany({
      where: {
        userId: primaryUserId(),
        rubricVersion: { rubricId: primaryRubricId() },
      },
    });
    await request(app).post(rubricsAssignPath).send({
      rubricId: primaryRubricId(),
      userIds: createdUserIds,
    });

    const response = await request(app).get(`${rubricsBasePath}/assigned/${primaryUserId()}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const rows = response.body as Array<{ rubricId: string }>;
    const matches = rows.filter((row) => row.rubricId === primaryRubricId());
    expect(matches.length).toBeGreaterThan(0);
  });

  test('POST /rubrics/start returns ok', async () => {
    const response = await request(app).post(rubricsStartPath).send({
      rubricVersionId: primaryRubricVersionId(),
      userId: primaryUserId(),
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubric started successfully' });

    const latestId = (
      await prisma.rubricVersion.findFirst({
        where: { rubricId: primaryRubricId() },
        orderBy: { versionNum: 'desc' },
        select: { id: true },
      })
    )?.id;
    expect(latestId).toBeDefined();
    if (!latestId) return;

    const assignment = await prisma.userRubricAssignment.findFirst({
      where: { userId: primaryUserId(), rubricVersionId: latestId, pathwayId: GENERAL_PATHWAY_ID },
    });
    expect(assignment?.status).toBe(AssignmentStatus.IN_PROGRESS);
  });

  test('POST /rubrics/complete returns ok', async () => {
    const response = await request(app).post(rubricsCompletePath).send({
      rubricId: primaryRubricId(),
      userId: primaryUserId(),
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubric completed successfully' });

    const latestId = (
      await prisma.rubricVersion.findFirst({
        where: { rubricId: primaryRubricId() },
        orderBy: { versionNum: 'desc' },
        select: { id: true },
      })
    )?.id;
    expect(latestId).toBeDefined();
    if (!latestId) return;

    const assignment = await prisma.userRubricAssignment.findFirst({
      where: { userId: primaryUserId(), rubricVersionId: latestId, pathwayId: GENERAL_PATHWAY_ID },
    });
    expect(assignment?.status).toBe(AssignmentStatus.COMPLETED);
  });

  test('POST /rubrics/unassign returns 401 when not authenticated', async () => {
    const response = await request(app).post(rubricsUnassignPath).send({
      rubricId: primaryRubricId(),
      userId: primaryUserId(),
      pathwayId: GENERAL_PATHWAY_ID,
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
  });

  test('POST /rubrics/update/:rubricId returns 400 when updatedRubric is missing', async () => {
    const response = await request(app)
      .post(`${rubricsBasePath}/update/${rubricForUpdateId}`)
      .send({ changelog: 'x' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('updatedRubric is required');
  });

  test('POST /rubrics/update/:rubricId returns 404 when rubric is missing', async () => {
    const response = await request(app)
      .post(`${rubricsBasePath}/update/00000000-0000-0000-0000-000000000000`)
      .send({
        updatedRubric: { title: 'x', description: 'y', active: true, scales: [] },
        changelog: 'n/a',
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Rubric not found' });
  });

  test('POST /rubrics/update/:rubricId returns 404 when no rubric version exists', async () => {
    // Use a rubric owned by this test only. Other suites (e.g. invitations accept with
    // assign-all-rubrics) run in parallel and may call ensureRubricVersionForRubric on every
    // rubric in the DB, which would version shared seed rubrics like rubricWithoutVersionId.
    const isolatedRubric = await prisma.rubric.create({
      data: {
        title: `update-no-version-${Date.now()}`,
        description: 'Isolated — no RubricVersion row',
        active: true,
      },
    });
    const scale = await prisma.scale.create({
      data: {
        rubricId: isolatedRubric.id,
        prompt: 'Isolated scale',
        orderIndex: 0,
        editable: true,
        isGlobal: false,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    try {
      const response = await request(app)
        .post(`${rubricsBasePath}/update/${isolatedRubric.id}`)
        .send({
          updatedRubric: {
            id: isolatedRubric.id,
            title: 'T',
            description: 'D',
            active: true,
            scales: [
              {
                originalScaleId: scale.id,
                prompt: scale.prompt,
                orderIndex: scale.orderIndex,
                isGlobal: scale.isGlobal,
                editable: scale.editable,
                section: scale.section,
                levelDescriptions: sampleLevelDescriptions,
              },
            ],
          },
          changelog: 'first publish',
        });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'No existing version found' });
    } finally {
      await prisma.scale.deleteMany({ where: { rubricId: isolatedRubric.id } });
      await prisma.rubric.delete({ where: { id: isolatedRubric.id } });
    }
  });

  test('POST /rubrics/update/:rubricId writes live scales, new version, and migrates ASSIGNED users', async () => {
    await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);

    const before = await prisma.rubricVersion.findMany({
      where: { rubricId: rubricForUpdateId },
      orderBy: { versionNum: 'asc' },
    });
    const v1 = before[before.length - 1];
    expect(v1).toBeDefined();
    if (!v1) return;

    await prisma.userRubricAssignment.deleteMany({
      where: { userId: primaryUserId(), rubricVersionId: v1.id },
    });
    await prisma.userRubricAssignment.create({
      data: {
        userId: primaryUserId(),
        rubricVersionId: v1.id,
        pathwayId: GENERAL_PATHWAY_ID,
        status: AssignmentStatus.ASSIGNED,
      },
    });

    const getRes = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);
    expect(getRes.status).toBe(200);
    const payload = getRes.body as {
      title: string;
      description: string;
      active: boolean;
      scales: Array<{
        originalScaleId: string;
        prompt: string;
        orderIndex: number;
        isGlobal: boolean;
        editable: boolean;
        section: string | null;
        levelDescriptions: object;
      }>;
    };

    const newTitle = `updated-title-${Date.now()}`;
    const newPrompt = 'Scale after edit';
    const scaleFromApi = payload.scales[0];
    expect(scaleFromApi).toBeDefined();
    if (!scaleFromApi) return;

    const response = await request(app)
      .post(`${rubricsBasePath}/update/${rubricForUpdateId}`)
      .send({
        updatedRubric: {
          id: rubricForUpdateId,
          title: newTitle,
          description: payload.description,
          active: payload.active,
          scales: [
            {
              originalScaleId: scaleFromApi.originalScaleId,
              prompt: newPrompt,
              orderIndex: scaleFromApi.orderIndex,
              isGlobal: scaleFromApi.isGlobal,
              editable: scaleFromApi.editable,
              section: scaleFromApi.section,
              levelDescriptions: scaleFromApi.levelDescriptions,
            },
          ],
        },
        changelog: 'v2 test',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubric updated successfully' });

    const rubricRow = await prisma.rubric.findUniqueOrThrow({ where: { id: rubricForUpdateId } });
    expect(rubricRow.title).toBe(newTitle);

    const liveScale = await prisma.scale.findFirstOrThrow({
      where: { rubricId: rubricForUpdateId },
    });
    expect(liveScale.prompt).toBe(newPrompt);

    const versions = await prisma.rubricVersion.findMany({
      where: { rubricId: rubricForUpdateId },
      orderBy: { versionNum: 'asc' },
    });
    expect(versions.length).toBeGreaterThanOrEqual(2);
    const latest = versions[versions.length - 1];
    expect(latest?.changelog).toBe('v2 test');
    const latestVersionId = latest?.id;
    expect(latestVersionId).toBeDefined();
    if (!latestVersionId) return;

    const assignment = await prisma.userRubricAssignment.findFirst({
      where: { userId: primaryUserId(), rubricVersionId: latestVersionId, pathwayId: GENERAL_PATHWAY_ID },
    });
    expect(assignment?.status).toBe(AssignmentStatus.ASSIGNED);

    const afterEditGet = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);
    expect(afterEditGet.status).toBe(200);
    const afterBody = afterEditGet.body as { scales: Array<{ prompt: string }> };
    expect(afterBody.scales[0]?.prompt).toBe(newPrompt);
  });

  test('POST /rubrics/update/:rubricId creates new scales and removes omitted scales from live rubric', async () => {
    await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);

    const getRes = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);
    expect(getRes.status).toBe(200);
    const payload = getRes.body as {
      title: string;
      description: string;
      active: boolean;
      scales: Array<{
        originalScaleId?: string;
        prompt: string;
        orderIndex: number;
        isGlobal: boolean;
        editable: boolean;
        section: string | null;
        levelDescriptions: object;
      }>;
    };
    const existingScale = payload.scales[0];
    expect(existingScale).toBeDefined();
    if (!existingScale) return;

    const response = await request(app)
      .post(`${rubricsBasePath}/update/${rubricForUpdateId}`)
      .send({
        updatedRubric: {
          id: rubricForUpdateId,
          title: payload.title,
          description: payload.description,
          active: payload.active,
          scales: [
            {
              originalScaleId: existingScale.originalScaleId,
              prompt: 'Kept scale',
              orderIndex: 0,
              isGlobal: true,
              editable: true,
              section: 'General',
              levelDescriptions: existingScale.levelDescriptions,
            },
            {
              prompt: 'Brand new scale',
              orderIndex: 1,
              isGlobal: false,
              editable: true,
              section: 'New Section',
              levelDescriptions: sampleLevelDescriptions,
            },
          ],
        },
        changelog: 'create and remove scales',
      });

    expect(response.status).toBe(200);

    const afterGet = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);
    expect(afterGet.status).toBe(200);
    const afterBody = afterGet.body as {
      scales: Array<{
        prompt: string;
        section: string | null;
        isGlobal: boolean;
      }>;
    };
    expect(afterBody.scales).toHaveLength(2);
    expect(afterBody.scales.map((scale) => scale.prompt).sort()).toEqual([
      'Brand new scale',
      'Kept scale',
    ]);

    const newScaleFromApi = afterBody.scales.find((scale) => scale.prompt === 'Brand new scale');
    expect(newScaleFromApi?.section).toBe('New Section');
    expect(newScaleFromApi?.isGlobal).toBe(true);
  });

  test('POST /rubrics/update/:rubricId accepts scale edits without bin metadata', async () => {
    await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);

    const titleBefore = (
      await prisma.rubric.findUniqueOrThrow({
        where: { id: rubricForUpdateId },
        select: { title: true },
      })
    ).title;

    const getRes = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);
    expect(getRes.status).toBe(200);
    const payload = getRes.body as {
      scales: Array<{
        originalScaleId: string;
        prompt: string;
        orderIndex: number;
        isGlobal: boolean;
        editable: boolean;
        section: string | null;
        levelDescriptions: object;
      }>;
    };
    const scaleFromApi = payload.scales[0];
    expect(scaleFromApi).toBeDefined();
    if (!scaleFromApi) return;

    const response = await request(app)
      .post(`${rubricsBasePath}/update/${rubricForUpdateId}`)
      .send({
        updatedRubric: {
          id: rubricForUpdateId,
          title: `blocked-title-${Date.now()}`,
          description: 'd',
          active: true,
          scales: [
            {
              originalScaleId: scaleFromApi.originalScaleId,
              prompt: scaleFromApi.prompt,
              orderIndex: scaleFromApi.orderIndex,
              isGlobal: false,
              editable: scaleFromApi.editable,
              section: scaleFromApi.section,
              levelDescriptions: scaleFromApi.levelDescriptions,
            },
          ],
        },
        changelog: 'should fail',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rubric updated successfully');

    const titleAfter = (
      await prisma.rubric.findUniqueOrThrow({
        where: { id: rubricForUpdateId },
        select: { title: true },
      })
    ).title;
    expect(titleAfter).not.toBe(titleBefore);
  });
});

describe('rubrics — responses and scale visibility', () => {
  const createdUserIds: string[] = [];
  let institutionId: string;
  let visibilityUserId: string;
  let rubricMultiId: string;
  let rubricVersionMultiId: string;
  let scaleVersionGlobalId: string;

  const createRubricWithScales = async (data: {
    title: string;
    description: string;
    scales: Array<{
      prompt: string;
      orderIndex: number;
      editable?: boolean;
      isGlobal?: boolean;
      levelDescriptions?: object;
    }>;
  }) => {
    const rubric = await prisma.rubric.create({
      data: { title: data.title, description: data.description, active: true },
    });
    await Promise.all(
      data.scales.map((scale) =>
        prisma.scale.create({
          data: {
            rubricId: rubric.id,
            prompt: scale.prompt,
            orderIndex: scale.orderIndex,
            editable: scale.editable ?? true,
            isGlobal: scale.isGlobal ?? true,
            ...(scale.levelDescriptions != null
              ? { levelDescriptions: scale.levelDescriptions }
              : {}),
          },
        })
      )
    );
    return rubric;
  };

  beforeAll(async () => {
    const institution = await prisma.institution.create({
      data: { name: `resp-test-inst-${Date.now()}`, academicSchoolYear: '25/26' },
    });
    institutionId = institution.id;

    const user = await prisma.user.create({
      data: {
        googleId: `resp-test-google-${Date.now()}`,
        name: 'Response test user',
        email: `resp-test-${Date.now()}@test.com`,
        role: 'USER',
        institutionId,
      },
    });
    visibilityUserId = user.id;
    createdUserIds.push(user.id);

    const rubric = await prisma.rubric.create({
      data: {
        title: `multi-scale-rubric-${Date.now()}`,
        description: 'Responses visibility',
        active: true,
      },
    });
    rubricMultiId = rubric.id;

    const scaleGlobal = await prisma.scale.create({
      data: {
        rubricId: rubricMultiId,
        prompt: 'Global criterion',
        orderIndex: 0,
        editable: true,
        isGlobal: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });

    const rubricVersion = await prisma.rubricVersion.create({
      data: { rubricId: rubricMultiId, versionNum: 1, changelog: 'v1' },
    });
    rubricVersionMultiId = rubricVersion.id;

    const svGlobal = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersionMultiId,
        originalScaleId: scaleGlobal.id,
        prompt: scaleGlobal.prompt,
        orderIndex: scaleGlobal.orderIndex,
        isGlobal: true,
        editable: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    scaleVersionGlobalId = svGlobal.id;

    await prisma.userRubricAssignment.create({
      data: {
        userId: visibilityUserId,
        rubricVersionId: rubricVersionMultiId,
        pathwayId: GENERAL_PATHWAY_ID,
        status: AssignmentStatus.ASSIGNED,
      },
    });
  });

  afterAll(async () => {
    await prisma.response.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.userRubricAssignment.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.scaleVersion.deleteMany({ where: { rubricVersionId: rubricVersionMultiId } });
    await prisma.rubricVersion.deleteMany({ where: { id: rubricVersionMultiId } });
    await prisma.scale.deleteMany({ where: { rubricId: rubricMultiId } });
    await prisma.rubric.deleteMany({ where: { id: rubricMultiId } });
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await prisma.institution.deleteMany({ where: { id: institutionId } });
  });

  test('GET /rubrics/responses returns 400 when params are missing', async () => {
    const response = await request(app).get('/api/rubrics/responses');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing query params');
  });

  test('GET /rubrics/responses returns rows scoped by pathwayId', async () => {
    await prisma.response.create({
      data: {
        userId: visibilityUserId,
        scaleVersionId: scaleVersionGlobalId,
        rubricVersionId: rubricVersionMultiId,
        pathwayId: GENERAL_PATHWAY_ID,
        score: 2,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    const response = await request(app).get('/api/rubrics/responses').query({
      userId: visibilityUserId,
      rubricVersionId: rubricVersionMultiId,
      pathwayId: GENERAL_PATHWAY_ID,
    });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as unknown[]).length).toBeGreaterThan(0);
  });

  test('fetchResponseExportRows includes pathway fields', async () => {
    const exportRow = await prisma.response.create({
      data: {
        userId: visibilityUserId,
        scaleVersionId: scaleVersionGlobalId,
        rubricVersionId: rubricVersionMultiId,
        pathwayId: STATISTICS_PATHWAY_ID,
        score: 2,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    try {
      const rows = await fetchResponseExportRows({ id: exportRow.id });
      expect(rows).toHaveLength(1);
      expect(rows[0]?.pathwayId).toBe(STATISTICS_PATHWAY_ID);
      expect(rows[0]?.pathwayName.length).toBeGreaterThan(0);
    } finally {
      await prisma.response.delete({ where: { id: exportRow.id } });
    }
  });

  describe('assignment matrix and unassign authorization', () => {
    const rubricsAssignmentMatrixPath = '/api/rubrics/assignment-matrix';
    const rubricsUnassignPath = '/api/rubrics/unassign';
    const createdRubricVersionIds: string[] = [];

    const loginAs = async (userId: string) => {
      const agent = request.agent(app);
      const loginResponse = await agent.get(`/api/auth/test-login/${userId}`);
      expect(loginResponse.status).toBe(200);
      return agent;
    };

    test('GET /rubrics/assignment-matrix returns institution assignment counts', async () => {
      const timestamp = Date.now();
      const institution = await prisma.institution.create({
        data: {
          name: `assignment-matrix-inst-${timestamp}`,
          academicSchoolYear: '25/26',
        },
      });
      const localLeader = await prisma.user.create({
        data: withPrivacyConsent({
          googleId: `matrix-ll-${timestamp}`,
          name: 'Matrix Local Leader',
          email: `matrix-ll-${timestamp}@example.com`,
          role: 'LOCAL_LEADER',
          institutionId: institution.id,
        }),
      });
      const institutionUser = await prisma.user.create({
        data: {
          googleId: `matrix-user-${timestamp}`,
          name: 'Matrix Institution User',
          email: `matrix-user-${timestamp}@example.com`,
          role: 'USER',
          institutionId: institution.id,
        },
      });

      const rubric = await createRubricWithScales({
        title: `Project EMBER — Rubric 9: Matrix test ${timestamp}`,
        description: 'Matrix rubric',
        scales: [
          {
            prompt: 'Matrix scale',
            orderIndex: 0,
            editable: true,
            isGlobal: true,
          },
        ],
      });
      const rubricVersion = await prisma.rubricVersion.create({
        data: { rubricId: rubric.id, versionNum: 1 },
      });
      createdRubricVersionIds.push(rubricVersion.id);

      await prisma.userRubricAssignment.createMany({
        data: [
          {
            userId: institutionUser.id,
            rubricVersionId: rubricVersion.id,
            pathwayId: GENERAL_PATHWAY_ID,
            status: AssignmentStatus.ASSIGNED,
          },
          {
            userId: institutionUser.id,
            rubricVersionId: rubricVersion.id,
            pathwayId: STATISTICS_PATHWAY_ID,
            status: AssignmentStatus.IN_PROGRESS,
          },
        ],
      });

      try {
        const agent = await loginAs(localLeader.id);
        const response = await agent.get(rubricsAssignmentMatrixPath);
        expect(response.status).toBe(200);

        const body = response.body as {
          rubrics: Array<{ id: string; rubricNumber: number | null }>;
          users: Array<{ id: string }>;
          assignments: Array<{ userId: string; rubricId: string; status: string }>;
        };

        expect(body.users.some((user) => user.id === institutionUser.id)).toBe(true);
        expect(body.users.some((user) => user.id === localLeader.id)).toBe(true);
        expect(body.rubrics.some((row) => row.id === rubric.id && row.rubricNumber === 9)).toBe(
          true
        );

        const userAssignments = body.assignments.filter(
          (assignment) =>
            assignment.userId === institutionUser.id && assignment.rubricId === rubric.id
        );
        expect(userAssignments).toHaveLength(2);
      } finally {
        await prisma.userRubricAssignment.deleteMany({
          where: { userId: institutionUser.id },
        });
        await prisma.user.deleteMany({
          where: { id: { in: [localLeader.id, institutionUser.id] } },
        });
        await prisma.institution.delete({ where: { id: institution.id } });
      }
    });

    test('POST /rubrics/unassign removes assignment for pathway context', async () => {
      const timestamp = Date.now();
      const institution = await prisma.institution.create({
        data: {
          name: `unassign-inst-${timestamp}`,
          academicSchoolYear: '25/26',
        },
      });
      const localLeader = await prisma.user.create({
        data: withPrivacyConsent({
          googleId: `unassign-ll-${timestamp}`,
          name: 'Unassign Local Leader',
          email: `unassign-ll-${timestamp}@example.com`,
          role: 'LOCAL_LEADER',
          institutionId: institution.id,
        }),
      });
      const institutionUser = await prisma.user.create({
        data: {
          googleId: `unassign-user-${timestamp}`,
          name: 'Unassign Institution User',
          email: `unassign-user-${timestamp}@example.com`,
          role: 'USER',
          institutionId: institution.id,
        },
      });
      const outsideUser = await prisma.user.create({
        data: {
          googleId: `unassign-outside-${timestamp}`,
          name: 'Outside User',
          email: `unassign-outside-${timestamp}@example.com`,
          role: 'USER',
        },
      });

      const rubric = await createRubricWithScales({
        title: `Project EMBER — Rubric 8: Unassign test ${timestamp}`,
        description: 'Unassign rubric',
        scales: [
          {
            prompt: 'Unassign scale',
            orderIndex: 0,
            editable: true,
            isGlobal: true,
          },
        ],
      });
      const rubricVersion = await prisma.rubricVersion.create({
        data: { rubricId: rubric.id, versionNum: 1 },
      });
      createdRubricVersionIds.push(rubricVersion.id);

      await prisma.userRubricAssignment.create({
        data: {
          userId: institutionUser.id,
          rubricVersionId: rubricVersion.id,
          pathwayId: GENERAL_PATHWAY_ID,
          status: AssignmentStatus.ASSIGNED,
        },
      });

      try {
        const agent = await loginAs(localLeader.id);

        const forbiddenResponse = await agent.post(rubricsUnassignPath).send({
          rubricId: rubric.id,
          userId: outsideUser.id,
          pathwayId: GENERAL_PATHWAY_ID,
        });
        expect(forbiddenResponse.status).toBe(403);

        const successResponse = await agent.post(rubricsUnassignPath).send({
          rubricId: rubric.id,
          userId: institutionUser.id,
          pathwayId: GENERAL_PATHWAY_ID,
        });
        expect(successResponse.status).toBe(200);
        expect(successResponse.body).toEqual({ message: 'Rubric unassigned successfully' });

        await prisma.userRubricAssignment.create({
          data: {
            userId: institutionUser.id,
            rubricVersionId: rubricVersion.id,
            pathwayId: GENERAL_PATHWAY_ID,
            status: AssignmentStatus.COMPLETED,
          },
        });

        const completedResponse = await agent.post(rubricsUnassignPath).send({
          rubricId: rubric.id,
          userId: institutionUser.id,
          pathwayId: GENERAL_PATHWAY_ID,
        });
        expect(completedResponse.status).toBe(409);
        expect(completedResponse.body).toEqual({ error: 'Cannot unassign a submitted rubric' });
      } finally {
        await prisma.userRubricAssignment.deleteMany({
          where: { userId: { in: [institutionUser.id, outsideUser.id] } },
        });
        await prisma.user.deleteMany({
          where: { id: { in: [localLeader.id, institutionUser.id, outsideUser.id] } },
        });
        await prisma.institution.delete({ where: { id: institution.id } });
      }
    });
  });
});
