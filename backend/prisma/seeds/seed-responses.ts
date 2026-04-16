import { prisma, ResponseStatus } from "@lib/prisma";

/** Stable IDs from `seed-user.ts` — responses are replaced on each seed run for idempotency. */
const SEED_USER_IDS = [
  "10000000-0000-0000-0000-000000000001",
  "10000000-0000-0000-0000-000000000002",
  "10000000-0000-0000-0000-000000000003",
  "10000000-0000-0000-0000-000000000004",
] as const;

/** Enough rows for charts / dashboards without making every seed painfully slow. */
const TARGET_RESPONSE_COUNT = 220;

const SCORE_MAX_EXCLUSIVE = 5;

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return (): number => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pickPredefinedBinId(
  predefinedBinIds: readonly string[],
  userBinSet: ReadonlySet<string>,
  random: () => number
): string | null {
  const allowed = predefinedBinIds.filter((id) => userBinSet.has(id));
  if (allowed.length === 0) {
    return null;
  }
  const index = Math.floor(random() * allowed.length);
  return allowed[index] ?? null;
}

async function main() {
  const random = createSeededRandom(20260329);

  await prisma.response.deleteMany({
    where: { userId: { in: [...SEED_USER_IDS] } },
  });

  const users = await prisma.user.findMany({
    where: { id: { in: [...SEED_USER_IDS] } },
    include: {
      userCourseBins: {
        include: { courseBin: { select: { id: true, predefinedBinId: true } } },
      },
    },
  });

  const userById = new Map(users.map((u) => [u.id, u]));

  const scaleVersions = await prisma.scaleVersion.findMany({
    include: { scaleVersionBins: true },
    orderBy: [{ rubricVersionId: "asc" }, { orderIndex: "asc" }],
  });

  type Compatible = {
    scaleVersionId: string;
    rubricVersionId: string;
    isGlobal: boolean;
    predefinedBinIds: string[];
  };

  function buildCompatibleList(userId: string): Compatible[] {
    const user = userById.get(userId);
    if (!user) {
      return [];
    }
    const userBinSet = new Set(
      user.userCourseBins.map((ucb) => ucb.courseBin.predefinedBinId)
    );
    const out: Compatible[] = [];
    for (const sv of scaleVersions) {
      const binIds = sv.scaleVersionBins.map((b) => b.predefinedBinId);
      if (sv.isGlobal) {
        out.push({
          scaleVersionId: sv.id,
          rubricVersionId: sv.rubricVersionId,
          isGlobal: true,
          predefinedBinIds: [],
        });
        continue;
      }
      const allowed = binIds.filter((id) => userBinSet.has(id));
      if (allowed.length === 0) {
        continue;
      }
      out.push({
        scaleVersionId: sv.id,
        rubricVersionId: sv.rubricVersionId,
        isGlobal: false,
        predefinedBinIds: allowed,
      });
    }
    return out;
  }

  const compatibleByUser = new Map<string, Compatible[]>();
  for (const id of SEED_USER_IDS) {
    compatibleByUser.set(id, buildCompatibleList(id));
  }

  const usersWithScales = [...SEED_USER_IDS].filter(
    (id) => (compatibleByUser.get(id)?.length ?? 0) > 0
  );

  if (usersWithScales.length === 0) {
    console.warn(
      "Response seed skipped — no seed user shares a predefined bin with any non-global scale (check course-bin assignments)."
    );
    return;
  }

  const rows: {
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseBinId: string | null;
    predefinedBinId: string | null;
    score: number;
    status: ResponseStatus;
    submittedAt: Date;
  }[] = [];

  let attempts = 0;
  const maxAttempts = TARGET_RESPONSE_COUNT * 25;
  const seenKeys = new Set<string>();

  while (rows.length < TARGET_RESPONSE_COUNT && attempts < maxAttempts) {
    attempts += 1;
    const userId = usersWithScales[Math.floor(random() * usersWithScales.length)]!;
    const list = compatibleByUser.get(userId)!;
    const entry = list[Math.floor(random() * list.length)]!;
    const user = userById.get(userId)!;
    const userBinSet = new Set(
      user.userCourseBins.map((ucb) => ucb.courseBin.predefinedBinId)
    );

    const predefinedBinId = entry.isGlobal
      ? null
      : pickPredefinedBinId(entry.predefinedBinIds, userBinSet, random);

    if (!entry.isGlobal && predefinedBinId === null) {
      continue;
    }

    let courseBinId: string | null = null;
    if (!entry.isGlobal && predefinedBinId) {
      const matchingCourseBin = user.userCourseBins.find(
        (ucb) => ucb.courseBin.predefinedBinId === predefinedBinId
      );
      if (!matchingCourseBin) {
        continue;
      }
      courseBinId = matchingCourseBin.courseBin.id;
    }

    const key = [
      userId,
      entry.scaleVersionId,
      entry.rubricVersionId,
      courseBinId ?? "global",
    ].join(":");
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);

    const score = Math.floor(random() * SCORE_MAX_EXCLUSIVE);
    const isDraft = random() < 0.08;
    const hoursAgo = Math.floor(random() * 24 * 45);

    rows.push({
      userId,
      scaleVersionId: entry.scaleVersionId,
      rubricVersionId: entry.rubricVersionId,
      courseBinId,
      predefinedBinId,
      score,
      status: isDraft ? ResponseStatus.DRAFT : ResponseStatus.SUBMITTED,
      submittedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
    });
  }

  const batchSize = 80;
  for (let index = 0; index < rows.length; index += batchSize) {
    const chunk = rows.slice(index, index + batchSize);
    await prisma.response.createMany({ data: chunk });
  }

  const draftCount = rows.filter((r) => r.status === ResponseStatus.DRAFT).length;
  console.log(
    `Response seed complete — ${rows.length} responses (${draftCount} draft, ${rows.length - draftCount} submitted); ` +
      `${usersWithScales.length} seed users had at least one compatible scale`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
