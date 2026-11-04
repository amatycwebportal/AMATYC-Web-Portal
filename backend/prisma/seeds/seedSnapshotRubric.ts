import { prisma } from "@lib/prisma";

const LEVEL_LABELS: Record<number, string> = {
  0: "Baseline",
  1: "Beginning",
  2: "Developing",
  3: "Accomplished",
  4: "Exemplar",
};

const SNAPSHOT_CHANGELOG = "2024 Teaching for PROWESS Snapshot rubric";

export type SnapshotCriterion = {
  id: string;
  scaleVersionId: string;
  section: string;
  prompt: string;
  orderIndex: number;
  levels: Record<number, string>;
};

export type SnapshotRubricSeed = {
  rubricId: string;
  rubricVersionId: string;
  title: string;
  description: string;
  criteria: SnapshotCriterion[];
};

function buildLevelDescriptions(descriptions: Record<number, string>) {
  return Object.fromEntries(
    Object.entries(descriptions).map(([score, description]) => [
      score,
      { label: LEVEL_LABELS[Number(score)], description },
    ])
  );
}

function buildCriterionFields(criterion: SnapshotCriterion) {
  return {
    prompt: criterion.prompt,
    orderIndex: criterion.orderIndex,
    editable: true,
    isGlobal: true,
    section: criterion.section,
    levelDescriptions: buildLevelDescriptions(criterion.levels),
  };
}

async function upsertRubric(seed: SnapshotRubricSeed) {
  await prisma.rubric.upsert({
    where: { id: seed.rubricId },
    update: {
      title: seed.title,
      description: seed.description,
      active: true,
    },
    create: {
      id: seed.rubricId,
      title: seed.title,
      description: seed.description,
      active: true,
    },
  });
}

async function upsertRubricVersion(seed: SnapshotRubricSeed) {
  await prisma.rubricVersion.upsert({
    where: { id: seed.rubricVersionId },
    update: { changelog: SNAPSHOT_CHANGELOG },
    create: {
      id: seed.rubricVersionId,
      rubricId: seed.rubricId,
      versionNum: 1,
      changelog: SNAPSHOT_CHANGELOG,
    },
  });
}

async function deleteScaleVersions(scaleVersionIds: string[]) {
  if (scaleVersionIds.length === 0) {
    return;
  }
  await prisma.response.deleteMany({
    where: { scaleVersionId: { in: scaleVersionIds } },
  });
  await prisma.scaleVersionBin.deleteMany({
    where: { scaleVersionId: { in: scaleVersionIds } },
  });
  await prisma.scaleVersion.deleteMany({
    where: { id: { in: scaleVersionIds } },
  });
}

async function removeStaleScales(seed: SnapshotRubricSeed) {
  const keptScaleIds = seed.criteria.map((criterion) => criterion.id);
  const staleScales = await prisma.scale.findMany({
    where: { rubricId: seed.rubricId, id: { notIn: keptScaleIds } },
    select: { id: true },
  });
  const staleVersions = await prisma.scaleVersion.findMany({
    where: {
      rubricVersionId: seed.rubricVersionId,
      originalScaleId: { notIn: keptScaleIds },
    },
    select: { id: true },
  });
  await deleteScaleVersions(staleVersions.map((version) => version.id));
  const staleScaleIds = staleScales.map((scale) => scale.id);
  if (staleScaleIds.length === 0) {
    return;
  }
  await prisma.scale.deleteMany({ where: { id: { in: staleScaleIds } } });
}

async function upsertCriteria(seed: SnapshotRubricSeed) {
  for (const criterion of seed.criteria) {
    const fields = buildCriterionFields(criterion);
    await prisma.scale.upsert({
      where: { id: criterion.id },
      update: fields,
      create: { id: criterion.id, rubricId: seed.rubricId, ...fields },
    });
    await prisma.scaleVersion.upsert({
      where: { id: criterion.scaleVersionId },
      update: fields,
      create: {
        id: criterion.scaleVersionId,
        rubricVersionId: seed.rubricVersionId,
        originalScaleId: criterion.id,
        ...fields,
      },
    });
  }
}

export async function seedSnapshotRubric(seed: SnapshotRubricSeed) {
  await upsertRubric(seed);
  await upsertRubricVersion(seed);
  await removeStaleScales(seed);
  await upsertCriteria(seed);
  console.log(`Rubric seed complete — ${seed.title} (${seed.criteria.length} criteria)`);
}
