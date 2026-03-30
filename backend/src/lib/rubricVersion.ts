import { prisma } from '@lib/prisma';

export async function findLatestRubricVersionId(rubricId: string): Promise<string | null> {
  const rubricVersion = await prisma.rubricVersion.findFirst({
    where: { rubricId },
    orderBy: { versionNum: 'desc' },
    select: { id: true },
  });
  return rubricVersion?.id ?? null;
}

/** Ensures at least one RubricVersion exists; creates v1 + ScaleVersions from current scales if needed. */
export async function ensureRubricVersionForRubric(rubricId: string): Promise<string> {
  const existingId = await findLatestRubricVersionId(rubricId);
  if (existingId) return existingId;

  const rubric = await prisma.rubric.findUnique({
    where: { id: rubricId },
    include: {
      scales: {
        orderBy: { orderIndex: 'asc' },
        include: { scaleBins: true },
      },
    },
  });
  if (!rubric) {
    throw new Error('Rubric not found');
  }

  const rubricVersion = await prisma.$transaction(async (transaction) => {
    const newRubricVersion = await transaction.rubricVersion.create({
      data: {
        rubricId,
        versionNum: 1,
        changelog: 'Initial version',
      },
    });
    for (const scale of rubric.scales) {
      const scaleVersion = await transaction.scaleVersion.create({
        data: {
          rubricVersionId: newRubricVersion.id,
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
      if (scale.scaleBins.length > 0) {
        await transaction.scaleVersionBin.createMany({
          data: scale.scaleBins.map((scaleBin) => ({
            scaleVersionId: scaleVersion.id,
            predefinedBinId: scaleBin.predefinedBinId,
          })),
        });
      }
    }
    return newRubricVersion;
  });
  return rubricVersion.id;
}
