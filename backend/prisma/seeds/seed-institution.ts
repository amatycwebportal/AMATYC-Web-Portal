import { prisma } from "@lib/prisma";

const INSTITUTION_SEED_ROWS = [
  { id: "00000000-0000-0000-0000-000000000001", name: "Institution", academicSchoolYear: "25/26" },
  { id: "00000000-0000-0000-0000-000000000002", name: "Riverside College", academicSchoolYear: "25/26" },
  { id: "00000000-0000-0000-0000-000000000003", name: "Northfield University", academicSchoolYear: "25/26" },
  { id: "00000000-0000-0000-0000-000000000004", name: "Central State Institute", academicSchoolYear: "25/26" },
  { id: "00000000-0000-0000-0000-000000000005", name: "Lakeview Polytechnic", academicSchoolYear: "25/26" },
  { id: "00000000-0000-0000-0000-000000000006", name: "Summit Teaching College", academicSchoolYear: "25/26" },
] as const;

async function main() {
  for (const row of INSTITUTION_SEED_ROWS) {
    await prisma.institution.upsert({
      where: { id: row.id },
      update: { name: row.name, academicSchoolYear: row.academicSchoolYear },
      create: { id: row.id, name: row.name, academicSchoolYear: row.academicSchoolYear },
    });
    console.log(`    [${row.id}] ${row.name}`);
  }
  console.log(`Institution seed complete — ${INSTITUTION_SEED_ROWS.length} institutions upserted`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
