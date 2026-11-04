import { prisma } from "@lib/prisma";
import { GENERAL_PATHWAY_ID, PATHWAYS } from "@shared/pathways";

const CONSENSUS_SEED_SCORE_MIN = 1;
const CONSENSUS_SEED_SCORE_MAX = 4;
const SEEDED_CONSENSUS_JUSTIFICATION =
  "Seeded institutional consensus for development and demo data.";

function pickRandomConsensusScore(): number {
  return (
    CONSENSUS_SEED_SCORE_MIN +
    Math.floor(
      Math.random() * (CONSENSUS_SEED_SCORE_MAX - CONSENSUS_SEED_SCORE_MIN + 1)
    )
  );
}

async function loadLatestRubricVersionIds(): Promise<string[]> {
  const allVersions = await prisma.rubricVersion.findMany({
    select: { id: true, rubricId: true, versionNum: true },
    orderBy: [{ rubricId: "asc" }, { versionNum: "desc" }],
  });
  const seenRubricIds = new Set<string>();
  const latestIds: string[] = [];
  for (const row of allVersions) {
    if (seenRubricIds.has(row.rubricId)) {
      continue;
    }
    seenRubricIds.add(row.rubricId);
    latestIds.push(row.id);
  }
  return latestIds;
}

async function main() {
  const localLeaders = await prisma.user.findMany({
    where: { role: "LOCAL_LEADER", institutionId: { not: null } },
    select: { id: true, institutionId: true },
  });

  const rubricVersionIds = await loadLatestRubricVersionIds();
  const allScaleVersions = await prisma.scaleVersion.findMany({
    where: { rubricVersionId: { in: rubricVersionIds } },
    orderBy: [{ rubricVersionId: "asc" }, { orderIndex: "asc" }],
    select: { id: true, rubricVersionId: true, orderIndex: true },
  });

  const scaleVersionsByRubricVersion = new Map<string, typeof allScaleVersions>();
  for (const scaleVersion of allScaleVersions) {
    const list = scaleVersionsByRubricVersion.get(scaleVersion.rubricVersionId) ?? [];
    list.push(scaleVersion);
    scaleVersionsByRubricVersion.set(scaleVersion.rubricVersionId, list);
  }

  let upsertCount = 0;
  for (const leader of localLeaders) {
    if (!leader.institutionId) continue;

    for (const rubricVersionId of rubricVersionIds) {
      const scaleVersions = scaleVersionsByRubricVersion.get(rubricVersionId) ?? [];
      if (scaleVersions.length === 0) continue;

      const entries = scaleVersions.map((scaleVersion) => ({
        scaleVersionId: scaleVersion.id,
        score: pickRandomConsensusScore(),
        justification: SEEDED_CONSENSUS_JUSTIFICATION,
      }));

      for (const pathway of PATHWAYS.slice(0, 2)) {
        await prisma.consensusResponse.upsert({
          where: {
            userId_rubricVersionId_pathwayId: {
              userId: leader.id,
              rubricVersionId,
              pathwayId: pathway.id,
            },
          },
          update: {
            status: "SUBMITTED",
            submittedAt: new Date(),
            entries,
          },
          create: {
            userId: leader.id,
            institutionId: leader.institutionId,
            rubricVersionId,
            pathwayId: pathway.id === GENERAL_PATHWAY_ID ? GENERAL_PATHWAY_ID : pathway.id,
            status: "SUBMITTED",
            submittedAt: new Date(),
            entries,
          },
        });
        upsertCount += 1;
      }
    }
  }

  console.log(`Consensus seed complete — ${upsertCount} consensus responses upserted`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
