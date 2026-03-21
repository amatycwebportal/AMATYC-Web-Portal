import { prisma } from "@lib/prisma";

async function main() {
  const institution = await prisma.institution.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: { id: "00000000-0000-0000-0000-000000000001", name: "Institution" },
  });
}
console.log(`Institution seed complete — [00000000-0000-0000-0000-000000000001] Institution`);
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
