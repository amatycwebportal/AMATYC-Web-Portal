import { prisma, ResponseStatus } from "@lib/prisma";
import { GENERAL_PATHWAY_ID, PATHWAYS } from "@shared/pathways";

const SEED_USER_IDS = [
  "10000000-0000-0000-0000-000000000001",
  "10000000-0000-0000-0000-000000000002",
  "10000000-0000-0000-0000-000000000003",
  "10000000-0000-0000-0000-000000000004",
] as const;

const TARGET_RESPONSE_COUNT = 220;

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return (): number => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

async function main() {
  const random = createSeededRandom(20260329);

  await prisma.response.deleteMany({
    where: { userId: { in: [...SEED_USER_IDS] } },
  });

  const users = await prisma.user.findMany({
    where: { id: { in: [...SEED_USER_IDS] } },
    select: { id: true },
  });
  if (users.length === 0) {
    console.log("Response seed skipped — no seed users found");
    return;
  }

  const scaleVersions = await prisma.scaleVersion.findMany({
    select: { id: true, rubricVersionId: true },
    orderBy: [{ rubricVersionId: "asc" }, { orderIndex: "asc" }],
  });
  if (scaleVersions.length === 0) {
    console.log("Response seed skipped — no scale versions found");
    return;
  }

  const pathwayIds = PATHWAYS.map((pathway) => pathway.id);
  const rows = [];
  for (let index = 0; index < TARGET_RESPONSE_COUNT; index += 1) {
    const user = users[Math.floor(random() * users.length)]!;
    const scale = scaleVersions[Math.floor(random() * scaleVersions.length)]!;
    const pathwayId =
      random() < 0.55
        ? GENERAL_PATHWAY_ID
        : pathwayIds[Math.floor(random() * pathwayIds.length)]!;
    rows.push({
      userId: user.id,
      scaleVersionId: scale.id,
      rubricVersionId: scale.rubricVersionId,
      pathwayId,
      score: Math.floor(random() * 5),
      justification: "Seeded response justification.",
      status: ResponseStatus.SUBMITTED,
    });
  }

  // Deduplicate by unique key
  const unique = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    unique.set(
      `${row.userId}:${row.scaleVersionId}:${row.rubricVersionId}:${row.pathwayId}`,
      row
    );
  }

  await prisma.response.createMany({
    data: [...unique.values()],
    skipDuplicates: true,
  });

  console.log(`Response seed complete — ${unique.size} responses created`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
