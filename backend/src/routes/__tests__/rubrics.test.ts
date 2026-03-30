import request from 'supertest';
import app from '../../app';
import { AssignmentStatus, prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const sampleLevelDescriptions = {
  '1': { label: 'Level 1', description: 'First' },
  '2': { label: 'Level 2', description: 'Second' },
};

describe('rubrics routes', () => {
  const primaryUserId = (): string => createdUserIds[0]!;
  const primaryRubricId = (): string => createdRubricIds[0]!;
  const primaryRubricVersionId = (): string => createdRubricVersionIds[0]!;
  const rubricsBasePath = '/rubrics';
  const rubricsAllPath = '/rubrics/all';
  const rubricsAssignPath = '/rubrics/assign';
  const rubricsUnassignPath = '/rubrics/unassign';
  const rubricsStartPath = '/rubrics/start';
  const rubricsCompletePath = '/rubrics/complete';
  const createdUserIds: string[] = [];
  const firstScaleOrderIndex = 0;
  const secondScaleOrderIndex = 1;

  const createdRubricIds: string[] = [];
  const createdPredefinedBinIds: string[] = [];
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
    predefinedBinIds?: string[];
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

    for (let index = 0; index < data.scales.length; index++) {
      const binIds = data.scales[index]?.predefinedBinIds;
      if (!binIds?.length) continue;
      const scale = createdScales[index];
      if (!scale) continue;
      await prisma.scaleBin.createMany({
        data: binIds.map((predefinedBinId) => ({
          scaleId: scale.id,
          predefinedBinId,
        })),
      });
    }

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
    const predefinedBin = await prisma.predefinedCourseBin.create({
      data: { binName: `test-predef-bin-${Date.now()}` },
    });
    createdPredefinedBinIds.push(predefinedBin.id);

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
          predefinedBinIds: [predefinedBin.id],
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
      if (scaleVersionIds.length > 0) {
        await prisma.scaleVersionBin.deleteMany({
          where: { scaleVersionId: { in: scaleVersionIds } },
        });
      }
      await prisma.scaleVersion.deleteMany({
        where: { rubricVersionId: { in: rubricVersionIds } },
      });
      await prisma.rubricVersion.deleteMany({
        where: { id: { in: rubricVersionIds } },
      });
    }

    await prisma.scaleBin.deleteMany({
      where: { scale: { rubricId: { in: createdRubricIds } } },
    });

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

    if (createdPredefinedBinIds.length > 0) {
      await prisma.predefinedCourseBin.deleteMany({
        where: { id: { in: createdPredefinedBinIds } },
      });
    }

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

  test('GET /rubrics/:rubricId ensures a version and returns scales with originalScaleId and binIds', async () => {
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
        binIds: string[];
        levelDescriptions: unknown;
      }>;
      versions: Array<{ id: string; versionNum: number }>;
    };

    expect(body.id).toBe(rubricForUpdateId);
    expect(body.scales).toHaveLength(1);
    expect(body.scales[0]?.originalScaleId).toBe(liveScale.id);
    expect(body.scales[0]?.prompt).toBe(liveScale.prompt);
    expect(body.versions[0]?.versionNum).toBe(1);
    expect(Array.isArray(body.scales[0]?.binIds)).toBe(true);
    const liveBinCount = await prisma.scaleBin.count({ where: { scaleId: liveScale.id } });
    expect(liveBinCount).toBeGreaterThan(0);

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

    const assignment = await prisma.userRubricAssignment.findUnique({
      where: {
        userId_rubricVersionId: { userId: primaryUserId(), rubricVersionId: latestId },
      },
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

    const assignment = await prisma.userRubricAssignment.findUnique({
      where: {
        userId_rubricVersionId: { userId: primaryUserId(), rubricVersionId: latestId },
      },
    });
    expect(assignment?.status).toBe(AssignmentStatus.COMPLETED);
  });

  test('POST /rubrics/unassign returns ok', async () => {
    const response = await request(app).post(rubricsUnassignPath).send({
      rubricId: primaryRubricId(),
      userId: primaryUserId(),
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubric unassigned successfully' });
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
                binIds: [],
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
        binIds: string[];
      }>;
    };

    const newTitle = `updated-title-${Date.now()}`;
    const newPrompt = 'Scale after edit';
    const scaleFromApi = payload.scales[0];
    expect(scaleFromApi).toBeDefined();
    if (!scaleFromApi) return;

    const binIdsForWrite = (
      await prisma.scaleBin.findMany({
        where: { scaleId: scaleFromApi.originalScaleId },
        select: { predefinedBinId: true },
      })
    ).map((row) => row.predefinedBinId);
    expect(binIdsForWrite.length).toBeGreaterThan(0);

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
              binIds: binIdsForWrite,
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

    const assignment = await prisma.userRubricAssignment.findUnique({
      where: {
        userId_rubricVersionId: { userId: primaryUserId(), rubricVersionId: latestVersionId },
      },
    });
    expect(assignment?.status).toBe(AssignmentStatus.ASSIGNED);

    const afterEditGet = await request(app).get(`${rubricsBasePath}/${rubricForUpdateId}`);
    expect(afterEditGet.status).toBe(200);
    const afterBody = afterEditGet.body as { scales: Array<{ binIds: string[] }> };
    expect(afterBody.scales[0]?.binIds.length).toBe(binIdsForWrite.length);
  });

  test('POST /rubrics/update/:rubricId returns 400 when non-global scale has no predefined bins', async () => {
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
        binIds: string[];
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
              binIds: [],
            },
          ],
        },
        changelog: 'should fail',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Non-global scales must include at least one predefined bin');

    const titleAfter = (
      await prisma.rubric.findUniqueOrThrow({
        where: { id: rubricForUpdateId },
        select: { title: true },
      })
    ).title;
    expect(titleAfter).toBe(titleBefore);
  });
});

describe('rubrics — responses and scale visibility', () => {
  const createdPredefinedBinIds: string[] = [];
  const createdUserIds: string[] = [];
  let institutionId: string;
  let predefinedBinSharedId: string;
  let predefinedBinOtherId: string;
  let courseBinForUserId: string;
  let courseBinOtherId: string;
  let visibilityUserId: string;
  let rubricMultiId: string;
  let rubricVersionMultiId: string;
  let scaleVersionGlobalId: string;
  let scaleVersionForUserBinId: string;
  let scaleVersionOtherBinId: string;

  beforeAll(async () => {
    const institution = await prisma.institution.create({
      data: { name: `resp-test-inst-${Date.now()}` },
    });
    institutionId = institution.id;

    const binShared = await prisma.predefinedCourseBin.create({
      data: { binName: `resp-test-bin-shared-${Date.now()}` },
    });
    const binOther = await prisma.predefinedCourseBin.create({
      data: { binName: `resp-test-bin-other-${Date.now()}` },
    });
    predefinedBinSharedId = binShared.id;
    predefinedBinOtherId = binOther.id;
    createdPredefinedBinIds.push(binShared.id, binOther.id);

    const courseForUser = await prisma.courseBin.create({
      data: {
        institutionId,
        predefinedBinId: predefinedBinSharedId,
        displayName: 'Course bin user has',
      },
    });
    const courseOther = await prisma.courseBin.create({
      data: {
        institutionId,
        predefinedBinId: predefinedBinOtherId,
        displayName: 'Course bin user lacks',
      },
    });
    courseBinForUserId = courseForUser.id;
    courseBinOtherId = courseOther.id;

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

    await prisma.userCourseBin.create({
      data: { userId: visibilityUserId, courseBinId: courseBinForUserId },
    });

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
    const scaleForSharedBin = await prisma.scale.create({
      data: {
        rubricId: rubricMultiId,
        prompt: 'Bin shared criterion',
        orderIndex: 1,
        editable: true,
        isGlobal: false,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    const scaleForOtherBin = await prisma.scale.create({
      data: {
        rubricId: rubricMultiId,
        prompt: 'Bin other criterion',
        orderIndex: 2,
        editable: true,
        isGlobal: false,
        levelDescriptions: sampleLevelDescriptions,
      },
    });

    await prisma.scaleBin.createMany({
      data: [
        { scaleId: scaleForSharedBin.id, predefinedBinId: predefinedBinSharedId },
        { scaleId: scaleForOtherBin.id, predefinedBinId: predefinedBinOtherId },
      ],
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
    const svShared = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersionMultiId,
        originalScaleId: scaleForSharedBin.id,
        prompt: scaleForSharedBin.prompt,
        orderIndex: scaleForSharedBin.orderIndex,
        isGlobal: false,
        editable: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    const svOther = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersionMultiId,
        originalScaleId: scaleForOtherBin.id,
        prompt: scaleForOtherBin.prompt,
        orderIndex: scaleForOtherBin.orderIndex,
        isGlobal: false,
        editable: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });

    scaleVersionGlobalId = svGlobal.id;
    scaleVersionForUserBinId = svShared.id;
    scaleVersionOtherBinId = svOther.id;

    await prisma.scaleVersionBin.createMany({
      data: [
        { scaleVersionId: svShared.id, predefinedBinId: predefinedBinSharedId },
        { scaleVersionId: svOther.id, predefinedBinId: predefinedBinOtherId },
      ],
    });

    await prisma.userRubricAssignment.create({
      data: {
        userId: visibilityUserId,
        rubricVersionId: rubricVersionMultiId,
        status: AssignmentStatus.ASSIGNED,
      },
    });
  });

  afterAll(async () => {
    await prisma.response.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.userRubricAssignment.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.userCourseBin.deleteMany({ where: { userId: { in: createdUserIds } } });

    const versionIds = await prisma.rubricVersion.findMany({
      where: { rubricId: rubricMultiId },
      select: { id: true },
    });
    const vIds = versionIds.map((row) => row.id);
    if (vIds.length > 0) {
      const scaleVersionIds = (
        await prisma.scaleVersion.findMany({
          where: { rubricVersionId: { in: vIds } },
          select: { id: true },
        })
      ).map((row) => row.id);
      if (scaleVersionIds.length > 0) {
        await prisma.scaleVersionBin.deleteMany({
          where: { scaleVersionId: { in: scaleVersionIds } },
        });
      }
      await prisma.scaleVersion.deleteMany({ where: { rubricVersionId: { in: vIds } } });
      await prisma.rubricVersion.deleteMany({ where: { id: { in: vIds } } });
    }

    await prisma.scaleBin.deleteMany({ where: { scale: { rubricId: rubricMultiId } } });
    await prisma.scale.deleteMany({ where: { rubricId: rubricMultiId } });
    await prisma.rubric.deleteMany({ where: { id: rubricMultiId } });

    await prisma.courseBin.deleteMany({
      where: { id: { in: [courseBinForUserId, courseBinOtherId] } },
    });
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await prisma.institution.deleteMany({ where: { id: institutionId } });
    await prisma.predefinedCourseBin.deleteMany({ where: { id: { in: createdPredefinedBinIds } } });
  });

  test('GET /rubrics/responses returns 400 when params are missing', async () => {
    const response = await request(app).get('/rubrics/responses');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing query params');
  });

  test('GET /rubrics/responses does not hit GET /rubrics/:rubricId for the word responses', async () => {
    const response = await request(app)
      .get(`/rubrics/responses`)
      .query({ userId: visibilityUserId, rubricVersionId: rubricVersionMultiId });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /rubrics/response-export does not hit GET /rubrics/:rubricId for the segment response-export', async () => {
    const response = await request(app).get('/rubrics/response-export').query({
      rubricId: '10000000-0000-0000-0000-000000000010',
    });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Not authenticated');
  });

  test('GET /rubrics/:rubricId returns 404 when the path segment is not a UUID', async () => {
    const response = await request(app).get('/rubrics/not-a-uuid');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Rubric not found');
  });

  test('GET /rubrics/assigned/:userId returns 404 when user is missing', async () => {
    const response = await request(app).get(
      `/rubrics/assigned/00000000-0000-0000-0000-000000000000`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  test('GET /rubrics/assigned/:userId filters out scales the user cannot access via bins', async () => {
    const response = await request(app).get(`/rubrics/assigned/${visibilityUserId}`);
    expect(response.status).toBe(200);
    const rows = response.body as Array<{
      id: string;
      scaleVersions: Array<{ id: string }>;
    }>;
    const row = rows.find((candidate) => candidate.id === rubricVersionMultiId);
    expect(row).toBeDefined();
    if (!row) return;
    const scaleIds = row.scaleVersions.map((scaleVersion) => scaleVersion.id);
    expect(scaleIds).toContain(scaleVersionGlobalId);
    expect(scaleIds).toContain(scaleVersionForUserBinId);
    expect(scaleIds).not.toContain(scaleVersionOtherBinId);
  });

  test('POST /rubrics/responses/save-draft saves global scale with null predefined bin', async () => {
    const saveRes = await request(app)
      .post(`/rubrics/responses/save-draft`)
      .send({
        userId: visibilityUserId,
        responses: [
          {
            scaleVersionId: scaleVersionGlobalId,
            rubricVersionId: rubricVersionMultiId,
            score: 2,
            predefinedBinId: null,
          },
        ],
      });
    expect(saveRes.status).toBe(200);

    const row = await prisma.response.findFirst({
      where: {
        userId: visibilityUserId,
        scaleVersionId: scaleVersionGlobalId,
        rubricVersionId: rubricVersionMultiId,
      },
    });
    expect(row).toBeDefined();
    expect(row?.predefinedBinId).toBeNull();
    expect(row?.score).toBe(2);
  });

  test('POST /rubrics/responses/save-draft rejects non-global scale without predefinedBinId', async () => {
    const saveRes = await request(app)
      .post(`/rubrics/responses/save-draft`)
      .send({
        userId: visibilityUserId,
        responses: [
          {
            scaleVersionId: scaleVersionForUserBinId,
            rubricVersionId: rubricVersionMultiId,
            score: 1,
          },
        ],
      });
    expect(saveRes.status).toBe(500);
    expect(saveRes.body.error).toBe('predefinedBinId is required for non-global scales');
  });

  test('POST /rubrics/responses/save-draft accepts non-global scale when bin matches user and scale', async () => {
    const saveRes = await request(app)
      .post(`/rubrics/responses/save-draft`)
      .send({
        userId: visibilityUserId,
        responses: [
          {
            scaleVersionId: scaleVersionForUserBinId,
            rubricVersionId: rubricVersionMultiId,
            score: 3,
            predefinedBinId: predefinedBinSharedId,
          },
        ],
      });
    expect(saveRes.status).toBe(200);

    const row = await prisma.response.findFirst({
      where: {
        userId: visibilityUserId,
        scaleVersionId: scaleVersionForUserBinId,
        rubricVersionId: rubricVersionMultiId,
        predefinedBinId: predefinedBinSharedId,
      },
    });
    expect(row).toBeDefined();
    expect(row?.score).toBe(3);
  });

  test('POST /rubrics/responses/save-draft rejects predefined bin user does not have', async () => {
    const saveRes = await request(app)
      .post(`/rubrics/responses/save-draft`)
      .send({
        userId: visibilityUserId,
        responses: [
          {
            scaleVersionId: scaleVersionOtherBinId,
            rubricVersionId: rubricVersionMultiId,
            score: 2,
            predefinedBinId: predefinedBinOtherId,
          },
        ],
      });
    expect(saveRes.status).toBe(500);
    expect(saveRes.body.error).toBe('User does not have access to this predefined bin');
  });

  test('GET /rubrics/responses returns saved rows for user and rubric version', async () => {
    const response = await request(app).get(`/rubrics/responses`).query({
      userId: visibilityUserId,
      rubricVersionId: rubricVersionMultiId,
    });
    expect(response.status).toBe(200);
    const list = response.body as Array<{ scaleVersionId: string }>;
    expect(list.length).toBeGreaterThanOrEqual(2);
    const scaleIds = list.map((item) => item.scaleVersionId);
    expect(scaleIds).toContain(scaleVersionGlobalId);
    expect(scaleIds).toContain(scaleVersionForUserBinId);
  });

  test('POST /rubrics/responses/submit marks drafts submitted', async () => {
    const submitRes = await request(app).post(`/rubrics/responses/submit`).send({
      userId: visibilityUserId,
      rubricVersionId: rubricVersionMultiId,
    });
    expect(submitRes.status).toBe(200);
    expect(submitRes.body.updatedCount).toBeGreaterThanOrEqual(1);

    const submitted = await prisma.response.findMany({
      where: {
        userId: visibilityUserId,
        rubricVersionId: rubricVersionMultiId,
        status: 'SUBMITTED',
      },
    });
    expect(submitted.length).toBeGreaterThanOrEqual(1);
  });
});
