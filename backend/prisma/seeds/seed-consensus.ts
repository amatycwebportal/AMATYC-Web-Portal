import { prisma } from "@lib/prisma";

const CONSENSUS_SEED_SCORE_MIN = 1;
const CONSENSUS_SEED_SCORE_MAX = 4;
const SEEDED_CONSENSUS_JUSTIFICATION =
  "Seeded institutional consensus for development and demo data.";

function pickRandomConsensusScore(): number {
  return (
    CONSENSUS_SEED_SCORE_MIN +
    Math.floor(
      Math.random() * (CONSENSUS_SEED_SCORE_MAX - CONSENSUS_SEED_SCORE_MIN + 1),
    )
  );
}

type ScaleVersionForConsensus = {
  id: string;
  rubricVersionId: string;
  isGlobal: boolean;
  orderIndex: number;
  scaleVersionBins: { predefinedBinId: string }[];
};

function buildConsensusEntries(scaleVersions: ScaleVersionForConsensus[]) {
  const ordered = [...scaleVersions].sort((a, b) => a.orderIndex - b.orderIndex);
  return ordered.map((sv) => {
    const score = pickRandomConsensusScore();
    if (sv.isGlobal) {
      return {
        scaleVersionId: sv.id,
        predefinedBinId: null,
        score,
        justification: SEEDED_CONSENSUS_JUSTIFICATION,
      };
    }
    if (sv.scaleVersionBins.length === 0) {
      throw new Error(`Seed consensus: non-global scale ${sv.id} has no scale version bins`);
    }
    const binIndex = Math.floor(Math.random() * sv.scaleVersionBins.length);
    const chosenBin = sv.scaleVersionBins[binIndex];
    if (!chosenBin) {
      throw new Error(`Seed consensus: non-global scale ${sv.id} has no scale version bins`);
    }
    return {
      scaleVersionId: sv.id,
      predefinedBinId: chosenBin.predefinedBinId,
      score,
      justification: SEEDED_CONSENSUS_JUSTIFICATION,
    };
  });
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
    include: { scaleVersionBins: true },
  });

  const scaleVersionsByRubricVersion = new Map<string, ScaleVersionForConsensus[]>();
  for (const sv of allScaleVersions) {
    const list = scaleVersionsByRubricVersion.get(sv.rubricVersionId) ?? [];
    list.push(sv);
    scaleVersionsByRubricVersion.set(sv.rubricVersionId, list);
  }

  let upsertCount = 0;
  for (const leader of localLeaders) {
    if (!leader.institutionId) {
      continue;
    }
    for (const rubricVersionId of rubricVersionIds) {
      const scaleVersions = scaleVersionsByRubricVersion.get(rubricVersionId);
      if (!scaleVersions?.length) {
        throw new Error(`Seed consensus: no scale versions for rubric version ${rubricVersionId}`);
      }
      const entries = buildConsensusEntries(scaleVersions);
      await prisma.consensusResponse.upsert({
        where: {
          userId_rubricVersionId: { userId: leader.id, rubricVersionId },
        },
        create: {
          userId: leader.id,
          institutionId: leader.institutionId,
          rubricVersionId,
          status: "SUBMITTED",
          submittedAt: new Date(),
          entries: entries as object[],
        },
        update: {
          institutionId: leader.institutionId,
          status: "SUBMITTED",
          submittedAt: new Date(),
          entries: entries as object[],
        },
      });
      upsertCount += 1;
    }
  }

  console.log(
    `Consensus seed complete — ${upsertCount} consensus responses upserted (${localLeaders.length} local leaders × ${rubricVersionIds.length} rubrics)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
