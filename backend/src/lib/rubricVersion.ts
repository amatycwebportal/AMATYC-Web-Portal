import { prisma, type Prisma } from '@lib/prisma';

type RubricVersionStore = Prisma.TransactionClient;

function resolveRubricVersionStore(client?: RubricVersionStore) {
  return client ?? prisma;
}

export async function findLatestRubricVersionId(
  rubricId: string,
  client?: RubricVersionStore
): Promise<string | null> {
  const rubricVersion = await resolveRubricVersionStore(client).rubricVersion.findFirst({
    where: { rubricId },
    orderBy: { versionNum: 'desc' },
    select: { id: true },
  });
  return rubricVersion?.id ?? null;
}

/** Ensures at least one RubricVersion exists; creates v1 + ScaleVersions from current scales if needed. */
export async function ensureRubricVersionForRubric(
  rubricId: string,
  client?: RubricVersionStore
): Promise<string> {
  const existingId = await findLatestRubricVersionId(rubricId, client);
  if (existingId) return existingId;

  if (client) {
    return createInitialRubricVersion(client, rubricId);
  }

  return prisma.$transaction((transaction) => createInitialRubricVersion(transaction, rubricId));
}

async function createInitialRubricVersion(
  client: RubricVersionStore,
  rubricId: string
): Promise<string> {
  const rubric = await client.rubric.findUnique({
    where: { id: rubricId },
    include: {
      scales: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
  if (!rubric) {
    throw new Error('Rubric not found');
  }

  const rubricVersion = await client.rubricVersion.create({
    data: {
      rubricId,
      versionNum: 1,
      changelog: 'Initial version',
    },
  });

  for (const scale of rubric.scales) {
    await client.scaleVersion.create({
      data: {
        rubricVersionId: rubricVersion.id,
        originalScaleId: scale.id,
        prompt: scale.prompt,
        orderIndex: scale.orderIndex,
        isGlobal: scale.isGlobal,
        editable: scale.editable,
        ...(scale.levelDescriptions != null
          ? { levelDescriptions: scale.levelDescriptions }
          : {}),
        ...(scale.section != null ? { section: scale.section } : {}),
      },
    });
  }

  return rubricVersion.id;
}
