import { prisma } from "@lib/prisma";


// =============================================================================
// SHARED BINS SEED
// Run this ONCE before running any individual rubric seed.
// All rubric seeds import these IDs by reference — do not change them.
// =============================================================================

export const BIN_IDS = {
  introMath:  "20000000-0000-0000-0000-000000000001",
  stemCore:   "20000000-0000-0000-0000-000000000002",
  dataScience:"20000000-0000-0000-0000-000000000003",
  calculus:   "20000000-0000-0000-0000-000000000004",
  statistics: "20000000-0000-0000-0000-000000000005",
} as const;

async function main() {
  const bins = [
    { id: BIN_IDS.introMath,   binName: "Introductory Mathematics" },
    { id: BIN_IDS.stemCore,    binName: "STEM Core" },
    { id: BIN_IDS.dataScience, binName: "Data Science" },
    { id: BIN_IDS.calculus,    binName: "Calculus" },
    { id: BIN_IDS.statistics,  binName: "Statistics" },
  ];

  for (const bin of bins) {
    await prisma.predefinedCourseBin.upsert({
      where: { id: bin.id },
      update: {},
      create: bin,
    });
  }

  console.log(`Bins seed complete — ${bins.length} bins upserted`);
  bins.forEach((b) => console.log(`    [${b.id}] ${b.binName}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
