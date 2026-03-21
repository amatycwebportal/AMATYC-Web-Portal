import { prisma } from "@lib/prisma";

async function main() {
  const courses = [
    { id: "80000000-0000-0000-0000-000000000001", courseNumber: "1", courseName: "CRSE", courseBinId: "70000000-0000-0000-0000-000000000001" },
    { id: "80000000-0000-0000-0000-000000000002", courseNumber: "2", courseName: "CRSE", courseBinId: "70000000-0000-0000-0000-000000000001" },
    { id: "80000000-0000-0000-0000-000000000003", courseNumber: "3", courseName: "CRSE", courseBinId: "70000000-0000-0000-0000-000000000002" },
  ];
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {},
      create: { id: course.id, courseNumber: course.courseNumber, courseName: course.courseName, courseBinId: "70000000-0000-0000-0000-000000000001" },
    });
  }
  console.log(`Courses seed complete — ${courses.length} courses upserted`);
  courses.forEach((c) => console.log(`    [${c.id}] ${c.courseNumber} ${c.courseName}`));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
