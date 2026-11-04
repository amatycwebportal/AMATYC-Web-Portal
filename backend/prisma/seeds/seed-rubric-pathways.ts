import { prisma } from "@lib/prisma";
import { PATHWAYS } from "@shared/pathways";

async function main() {
  const rubrics = await prisma.rubric.findMany({ select: { id: true } });
  let linkCount = 0;

  for (const rubric of rubrics) {
    for (const pathway of PATHWAYS) {
      await prisma.rubricPathway.upsert({
        where: {
          rubricId_pathwayId: {
            rubricId: rubric.id,
            pathwayId: pathway.id,
          },
        },
        update: {},
        create: {
          rubricId: rubric.id,
          pathwayId: pathway.id,
        },
      });
      linkCount += 1;
    }
  }

  console.log(
    `Rubric pathway seed complete — linked ${rubrics.length} rubrics to ${PATHWAYS.length} pathways (${linkCount} rows)`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
