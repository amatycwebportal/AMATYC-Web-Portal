import { prisma } from "@lib/prisma";
import { PATHWAYS } from "@shared/pathways";

async function main() {
  for (const pathway of PATHWAYS) {
    await prisma.pathway.upsert({
      where: { id: pathway.id },
      update: { name: pathway.name, sortOrder: pathway.sortOrder },
      create: {
        id: pathway.id,
        name: pathway.name,
        sortOrder: pathway.sortOrder,
      },
    });
  }

  console.log(`Pathway seed complete — ${PATHWAYS.length} pathways upserted`);
  PATHWAYS.forEach((pathway) => console.log(`    [${pathway.id}] ${pathway.name}`));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
