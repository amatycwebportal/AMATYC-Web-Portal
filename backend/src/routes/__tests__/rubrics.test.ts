import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('rubrics routes', () => {
  const rubricsBasePath = '/rubrics';
  const rubricsAllPath = '/rubrics/all';

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

      expect(rubricFromApi.title).toBe(expectedRubric.title);
      expect(rubricFromApi.description).toBe(expectedRubric.description);

      const sortedApiScales = rubricFromApi.scales.sort((a, b) => a.orderIndex - b.orderIndex);

      expect(sortedApiScales).toHaveLength(expectedRubric.scales.length);

      sortedApiScales.forEach((scale, index) => {
        expect(scale.prompt).toBe(expectedRubric.scales[index].prompt);
        expect(scale.orderIndex).toBe(expectedRubric.scales[index].orderIndex);
        expect(scale.editable).toBe(expectedRubric.scales[index].editable);
        expect(scale.isGlobal).toBe(expectedRubric.scales[index].isGlobal);
      });
    });
  });
});
