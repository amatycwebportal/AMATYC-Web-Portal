import { prisma } from "@lib/prisma";

async function main() {
  const courseBins = [
    { id: "70000000-0000-0000-0000-000000000001", name: "Into Geometry", predefinedBinId: "20000000-0000-0000-0000-000000000001" },
    { id: "70000000-0000-0000-0000-000000000002", name: "Intro Calculus", predefinedBinId: "20000000-0000-0000-0000-000000000001" },
    { id: "70000000-0000-0000-0000-000000000003", name: "Advanced Calculus", predefinedBinId: "20000000-0000-0000-0000-000000000004" },
  ];
  for (const courseBin of courseBins) {
    await prisma.courseBin.upsert({
      where: { id: courseBin.id },
      update: {},
      create: { id: courseBin.id, displayName: courseBin.name, predefinedBinId: courseBin.predefinedBinId, institutionId: "00000000-0000-0000-0000-000000000001" },
    });
  }
  console.log(`Course bins seed complete — ${courseBins.length} course bins upserted`);
  courseBins.forEach((cb) => console.log(`    [${cb.id}] ${cb.name}`));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
