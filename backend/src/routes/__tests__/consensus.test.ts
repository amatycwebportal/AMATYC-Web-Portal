/**
 * Integration tests for `/consensus` (local leader, institution-scoped).
 * Requires a reachable `DATABASE_URL` and a Prisma client that includes `ConsensusResponse`
 * (run `npx prisma migrate dev` then `npx prisma generate` after schema changes).
 */
import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { AssignmentStatus, prisma } from '@lib/prisma';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

function isConsensusModelOnClient(): boolean {
  const delegate = (prisma as unknown as { consensusResponse?: { deleteMany: unknown } })
    .consensusResponse;
  return typeof delegate?.deleteMany === 'function';
}

const sampleLevelDescriptions = {
  '0': { label: '(0) Baseline', description: 'L0' },
  '1': { label: '(1) Beginning', description: 'L1' },
  '2': { label: '(2) Developing', description: 'L2' },
  '3': { label: '(3) Accomplished', description: 'L3' },
  '4': { label: '(4) Exemplar', description: 'L4' },
};

describe.skipIf(!isConsensusModelOnClient())('consensus routes', () => {
  const basePath = '/api/consensus';

  const institutionId = randomUUID();
  let localLeaderId = '';
  let facultyAssignedId = '';
  let facultyInProgressId = '';
  let facultyCompletedId = '';
  let rubricId = '';
  let rubricVersionId = '';
  let scaleVersionId = '';

  const authAgent = () => request.agent(app);

  const loginAs = async (userId: string) => {
    const agent = authAgent();
    const loginResponse = await agent.get(`/api/auth/test-login/${userId}`);
    expect(loginResponse.status).toBe(200);
    return agent;
  };

  beforeAll(async () => {
    const timestamp = Date.now();

    await prisma.institution.create({
      data: { id: institutionId, name: `consensus-test-inst-${timestamp}` },
    });

    const localLeader = await prisma.user.create({
      data: {
        googleId: `test-google-consensus-ll-${timestamp}`,
        name: 'Consensus test local leader',
        email: `consensus-ll-${timestamp}@example.com`,
        role: 'LOCAL_LEADER',
        institutionId,
      },
    });
    localLeaderId = localLeader.id;

    const fa = await prisma.user.create({
      data: {
        googleId: `test-google-consensus-fa-${timestamp}`,
        name: 'Consensus faculty assigned',
        email: `consensus-fa-${timestamp}@example.com`,
        role: 'FACULTY',
        institutionId,
      },
    });
    facultyAssignedId = fa.id;

    const fi = await prisma.user.create({
      data: {
        googleId: `test-google-consensus-fi-${timestamp}`,
        name: 'Consensus faculty in progress',
        email: `consensus-fi-${timestamp}@example.com`,
        role: 'FACULTY',
        institutionId,
      },
    });
    facultyInProgressId = fi.id;

    const fc = await prisma.user.create({
      data: {
        googleId: `test-google-consensus-fc-${timestamp}`,
        name: 'Consensus faculty completed',
        email: `consensus-fc-${timestamp}@example.com`,
        role: 'FACULTY',
        institutionId,
      },
    });
    facultyCompletedId = fc.id;

    const rubric = await prisma.rubric.create({
      data: {
        title: `consensus-rubric-${timestamp}`,
        description: 'Consensus route tests',
        active: true,
      },
    });
    rubricId = rubric.id;

    const scale = await prisma.scale.create({
      data: {
        rubricId: rubric.id,
        prompt: 'Global criterion for consensus tests',
        orderIndex: 0,
        editable: true,
        isGlobal: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });

    const rubricVersion = await prisma.rubricVersion.create({
      data: { rubricId: rubric.id, versionNum: 1, changelog: 'v1' },
    });
    rubricVersionId = rubricVersion.id;

    const scaleVersion = await prisma.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersion.id,
        originalScaleId: scale.id,
        prompt: scale.prompt,
        orderIndex: 0,
        isGlobal: true,
        editable: true,
        levelDescriptions: sampleLevelDescriptions,
      },
    });
    scaleVersionId = scaleVersion.id;

    await prisma.userRubricAssignment.createMany({
      data: [
        {
          userId: facultyAssignedId,
          rubricVersionId: rubricVersion.id,
          status: AssignmentStatus.ASSIGNED,
        },
        {
          userId: facultyInProgressId,
          rubricVersionId: rubricVersion.id,
          status: AssignmentStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
        {
          userId: facultyCompletedId,
          rubricVersionId: rubricVersion.id,
          status: AssignmentStatus.COMPLETED,
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
    });

    await prisma.response.createMany({
      data: [
        {
          userId: facultyInProgressId,
          rubricVersionId: rubricVersion.id,
          scaleVersionId: scaleVersion.id,
          score: 2,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
        {
          userId: facultyCompletedId,
          rubricVersionId: rubricVersion.id,
          scaleVersionId: scaleVersion.id,
          score: 4,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      ],
    });
  });

  afterAll(async () => {
    if (!rubricVersionId || !rubricId) return;

    await prisma.consensusResponse.deleteMany({
      where: { rubricVersionId },
    });
    await prisma.response.deleteMany({ where: { rubricVersionId } });
    await prisma.userRubricAssignment.deleteMany({ where: { rubricVersionId } });
    await prisma.scaleVersion.deleteMany({ where: { rubricVersionId } });
    await prisma.rubricVersion.deleteMany({ where: { id: rubricVersionId } });
    await prisma.scale.deleteMany({ where: { rubric: { id: rubricId } } });
    await prisma.rubric.deleteMany({ where: { id: rubricId } });

    const userIds = [
      localLeaderId,
      facultyAssignedId,
      facultyInProgressId,
      facultyCompletedId,
    ].filter(Boolean);
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.institution.deleteMany({ where: { id: institutionId } });
  });

  test('GET /consensus/completion-by-rubric returns 401 when not logged in', async () => {
    const response = await request(app).get(`${basePath}/completion-by-rubric`);
    expect(response.status).toBe(401);
  });

  test('GET /consensus/completion-by-rubric returns 403 for faculty', async () => {
    const agent = await loginAs(facultyAssignedId);
    const response = await agent.get(`${basePath}/completion-by-rubric`);
    expect(response.status).toBe(403);
  });

  test('GET /consensus/completion-by-rubric returns empty set before any submission', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(`${basePath}/completion-by-rubric`);
    expect(response.status).toBe(200);
    expect(response.body.rubricIdsWithSubmittedConsensus).toEqual([]);
  });

  test('GET /consensus/assignment-summary returns 400 without rubricId', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(`${basePath}/assignment-summary`);
    expect(response.status).toBe(400);
  });

  test('GET /consensus/assignment-summary returns institution and assignment counts', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(
      `${basePath}/assignment-summary?rubricId=${encodeURIComponent(rubricId)}`
    );
    expect(response.status).toBe(200);
    expect(response.body.rubricVersionId).toBe(rubricVersionId);
    expect(response.body.totalInstitutionUsers).toBe(4);
    expect(response.body.assigned).toBe(1);
    expect(response.body.inProgress).toBe(1);
    expect(response.body.completed).toBe(1);
  });

  test('GET /consensus/scale-distributions aggregates submitted responses for institution', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(
      `${basePath}/scale-distributions?rubricVersionId=${encodeURIComponent(rubricVersionId)}`
    );
    expect(response.status).toBe(200);
    const byScale = response.body.byScaleVersionId as Record<
      string,
      { scoreCounts: Record<string, number>; average: number }
    >;
    const insight = byScale[scaleVersionId];
    expect(insight).toBeDefined();
    if (!insight) return;
    const counts = insight.scoreCounts as Record<string, number>;
    expect(counts['2']).toBe(1);
    expect(counts['4']).toBe(1);
    expect(insight.average).toBe(3);
  });

  test('GET /consensus/rubric-versions lists versions for rubricId', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(
      `${basePath}/rubric-versions?rubricId=${encodeURIComponent(rubricId)}`
    );
    expect(response.status).toBe(200);
    const versions = response.body.versions as Array<{ id: string; versionNum: number }>;
    expect(Array.isArray(versions)).toBe(true);
    expect(versions.some((v) => v.id === rubricVersionId)).toBe(true);
  });

  test('GET /consensus/scale-distributions excludes responses after submittedTo', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(
      `${basePath}/scale-distributions?${new URLSearchParams({
        rubricVersionId,
        submittedTo: '2000-01-01',
      }).toString()}`
    );
    expect(response.status).toBe(200);
    const byScale = response.body.byScaleVersionId as Record<string, unknown>;
    expect(byScale[scaleVersionId]).toBeUndefined();
  });

  test('GET /consensus/scale-distributions: plain YYYY-MM-DD is GMT day; ISO bounds include next-UTC-day instants', async () => {
    const agent = await loginAs(localLeaderId);
    const submittedAt = new Date('2026-03-31T03:43:30.871Z');
    const extra = await prisma.response.create({
      data: {
        userId: facultyCompletedId,
        rubricVersionId,
        scaleVersionId,
        score: 1,
        status: 'SUBMITTED',
        submittedAt,
      },
    });
    try {
      const plainTo = await agent.get(
        `${basePath}/scale-distributions?${new URLSearchParams({
          rubricVersionId,
          submittedTo: '2026-03-30',
        }).toString()}`
      );
      expect(plainTo.status).toBe(200);
      const plainInsight = plainTo.body.byScaleVersionId[scaleVersionId] as
        | { scoreCounts: Record<string, number> }
        | undefined;
      expect(plainInsight?.scoreCounts?.['1'] ?? 0).toBe(0);

      const isoRange = await agent.get(
        `${basePath}/scale-distributions?${new URLSearchParams({
          rubricVersionId,
          submittedFrom: '2026-03-31T03:40:00.000Z',
          submittedTo: '2026-03-31T03:45:00.000Z',
        }).toString()}`
      );
      expect(isoRange.status).toBe(200);
      const isoInsight = isoRange.body.byScaleVersionId[scaleVersionId] as {
        scoreCounts: Record<string, number>;
      };
      expect(isoInsight.scoreCounts['1']).toBe(1);
    } finally {
      await prisma.response.delete({ where: { id: extra.id } });
    }
  });

  test('GET /consensus/me returns null before saving', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(
      `${basePath}/me?rubricVersionId=${encodeURIComponent(rubricVersionId)}`
    );
    expect(response.status).toBe(200);
    expect(response.body.consensus).toBeNull();
  });

  test('POST /consensus/save-draft persists partial entries', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.post(`${basePath}/save-draft`).send({
      rubricVersionId,
      entries: [
        {
          scaleVersionId,
          predefinedBinId: null,
          score: 3,
          justification: '',
        },
      ],
    });
    expect(response.status).toBe(200);

    const row = await prisma.consensusResponse.findUnique({
      where: {
        userId_rubricVersionId: { userId: localLeaderId, rubricVersionId },
      },
    });
    expect(row).not.toBeNull();
    expect(row?.status).toBe('DRAFT');
    const entries = row?.entries as unknown[];
    expect(Array.isArray(entries)).toBe(true);
    expect(entries).toHaveLength(1);
    const first = entries[0] as { score: number };
    expect(first.score).toBe(3);
  });

  test('GET /consensus/me returns draft after save', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(
      `${basePath}/me?rubricVersionId=${encodeURIComponent(rubricVersionId)}`
    );
    expect(response.status).toBe(200);
    expect(response.body.consensus?.status).toBe('DRAFT');
  });

  test('POST /consensus/submit returns 400 when justification is empty', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.post(`${basePath}/submit`).send({
      rubricVersionId,
      entries: [
        {
          scaleVersionId,
          predefinedBinId: null,
          score: 3,
          justification: '   ',
        },
      ],
    });
    expect(response.status).toBe(400);
    expect(String(response.body.error)).toMatch(/justification/i);
  });

  test('POST /consensus/submit succeeds with justification', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.post(`${basePath}/submit`).send({
      rubricVersionId,
      entries: [
        {
          scaleVersionId,
          predefinedBinId: null,
          score: 3,
          justification: 'Team aligned on exemplar-level evidence for this criterion.',
        },
      ],
    });
    expect(response.status).toBe(200);

    const row = await prisma.consensusResponse.findUnique({
      where: {
        userId_rubricVersionId: { userId: localLeaderId, rubricVersionId },
      },
    });
    expect(row?.status).toBe('SUBMITTED');
    expect(row?.submittedAt).not.toBeNull();
  });

  test('GET /consensus/completion-by-rubric includes rubric after submission', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.get(`${basePath}/completion-by-rubric`);
    expect(response.status).toBe(200);
    expect(response.body.rubricIdsWithSubmittedConsensus).toContain(rubricId);
  });

  test('POST /consensus/save-draft returns 400 when already submitted', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.post(`${basePath}/save-draft`).send({
      rubricVersionId,
      entries: [
        {
          scaleVersionId,
          predefinedBinId: null,
          score: 2,
          justification: 'noop',
        },
      ],
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Submitted consensus cannot be edited');
  });

  test('POST /consensus/submit returns 400 when already submitted', async () => {
    const agent = await loginAs(localLeaderId);
    const response = await agent.post(`${basePath}/submit`).send({
      rubricVersionId,
      entries: [
        {
          scaleVersionId,
          predefinedBinId: null,
          score: 3,
          justification: 'Again',
        },
      ],
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Consensus already submitted');
  });
});
