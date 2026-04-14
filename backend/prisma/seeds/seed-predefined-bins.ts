import { prisma } from "@lib/prisma";


// =============================================================================
// SHARED BINS SEED
// Run this ONCE before running any individual rubric seed.
// All rubric seeds import these IDs by reference — do not change them.
// =============================================================================





export const BIN_IDS = {
  quant_reasoning:  "20000000-0000-0000-0000-000000000001",
  college_algebra:   "20000000-0000-0000-0000-000000000002",
  precalculus: "20000000-0000-0000-0000-000000000003",
  calculus_1:   "20000000-0000-0000-0000-000000000004",
  calculus_2:   "20000000-0000-0000-0000-000000000005",
  intro_statistics: "20000000-0000-0000-0000-000000000006",  
} as const;

async function main() {
  const predefinedBins = [
    { id: BIN_IDS.quant_reasoning,   binName: "Quantitative Reasoning" },
    { id: BIN_IDS.college_algebra,    binName: "College Algebra" },
    { id: BIN_IDS.precalculus, binName: "Precalculus" },
    { id: BIN_IDS.calculus_1,    binName: "Calculus 1" },
    { id: BIN_IDS.calculus_2,    binName: "Calculus 2" },
    { id: BIN_IDS.intro_statistics,  binName: "Intro Statistics" },
  ];

  for (const bin of predefinedBins) {
    await prisma.predefinedCourseBin.upsert({
      where: { id: bin.id },
      update: {},
      create: bin,
    });
  }

  console.log(`Predefined bins seed complete — ${predefinedBins.length} predefined bins upserted`);
  predefinedBins.forEach((b) => console.log(`    [${b.id}] ${b.binName}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
