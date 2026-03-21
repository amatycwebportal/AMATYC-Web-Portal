import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('rubrics routes', () => {
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

  const createRubricWithScales = async (data: {
    title: string;
    description: string;
    scales: Array<{
      prompt: string;
      orderIndex: number;
      editable?: boolean;
      isGlobal?: boolean;
    }>;
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
  });

  afterAll(async () => {
    if (createdRubricIds.length === 0) return;

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
     } 
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
    }>;

    const rubricIds = createdRubricIds;

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
  test('POST /rubrics/assign returns ok', async () => {
    const response = await request(app).post(rubricsAssignPath).send({
      rubricId: createdRubricIds[0],
      userIds: createdUserIds,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubrics assigned successfully' });
  });
  test('POST /rubrics/assign returns not ok', async () => {
    const response = await request(app).post(rubricsAssignPath).send({
      rubricId: createdRubricIds[0],
      userIds: [],
    });
    expect(response.status).toBe(406);
    expect(response.body).toEqual({ error: 'Rubric or users not found' });
  });
  test('POST /rubrics/unassign returns ok', async () => {
    const response = await request(app).post(rubricsUnassignPath).send({
      rubricId: createdRubricIds[0],
      userId: createdUserIds[0],
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubric unassigned successfully' });
  });
  test('POST /rubrics/start returns ok', async () => {
    const response = await request(app).post(rubricsStartPath).send({
      rubricId: createdRubricIds[0],
      userId: createdUserIds[0],
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Rubric started successfully' });
  });
});
