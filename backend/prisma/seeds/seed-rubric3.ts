import { prisma } from "@lib/prisma";

const BIN_INTRO_MATH  = "20000000-0000-0000-0000-000000000001";
const BIN_STEM_CORE   = "20000000-0000-0000-0000-000000000002";
const BIN_CALCULUS    = "20000000-0000-0000-0000-000000000004";
const BIN_STATISTICS  = "20000000-0000-0000-0000-000000000005";

const LEVEL_LABELS: Record<number, string> = {
  0: "Baseline", 1: "Beginning", 2: "Developing", 3: "Accomplished", 4: "Exemplar",
};
function levels(d: Record<number, string>) {
  return Object.fromEntries(
    Object.entries(d).map(([k, v]) => [k, { label: LEVEL_LABELS[Number(k)], description: v }])
  );
}

async function main() {
  const rubric = await prisma.rubric.upsert({
    where: { id: "10000000-0000-0000-0000-000000000030" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000030",
      title: "Project EMBER — Rubric 3: Introductory Mathematics Course Structures (5 criteria)",
      description:
        "Assesses introductory course structures in mathematics to determine how best they align " +
        "with the current needs of students and current needs of partner disciplines. Includes " +
        "assessment of supplemental support courses, course sequences for partner disciplines, " +
        "alignment of credit-bearing and non-credit-bearing offerings, and mathematics pathway alignment.",
      active: true,
    },
  });

  const scalesData = [
    // ── Section A: Introductory Mathematics Course Offerings ──────────────
    {
      id: "30000000-0000-0000-0003-000000000001",
      section: "A. Introductory Mathematics Course Offerings",
      prompt:
        "3.A1. Supplemental support courses are offered by the Mathematics (or other) Department for " +
        "students not prepared to take credit-bearing college mathematics courses.",
      orderIndex: 1, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department does not offer any academic support courses. Students must take credit-bearing courses, regardless of their preparedness.",
        1: "The department offers limited non-credit bearing academic support courses or developmental mathematics courses, but they are not clearly designed to align with the course pathways. There is no integration of co-requisite (or stretched) courses.",
        2: "The department offers developmental mathematics courses prior to credit-bearing courses. These courses are somewhat aligned with the course pathways. Co-requisite (or stretched) courses are available for some relevant credit-bearing courses.",
        3: "The department offers a range of academic support courses designed to support students in course pathways. Co-requisite courses are available and are integrated effectively into the relevant credit-bearing courses.",
        4: "The department offers a comprehensive and well-coordinated suite of academic support courses, including fully integrated co-requisite courses for all relevant credit-bearing courses. All developmental mathematics courses have been replaced with co-requisite (or stretched) courses.",
      }),
    },
    {
      id: "30000000-0000-0000-0003-000000000002",
      section: "A. Introductory Mathematics Course Offerings",
      prompt:
        "3.A2. Department offers course sequences that meet the needs of partner disciplines.",
      orderIndex: 2, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No discipline-specific courses are offered.",
        1: "Limited course variations focused on one partner discipline.",
        2: "Moderate range of course variations covering several disciplines.",
        3: "Wide range of course variations meeting the needs of most major disciplines.",
        4: "Course variations are tailored to meet the needs of vital major and minor disciplines.",
      }),
    },
    // ── Section B: Alignment of Introductory Course Offerings ─────────────
    {
      id: "30000000-0000-0000-0003-000000000003",
      section: "B. Alignment of Introductory Course Offerings",
      prompt:
        "3.B1. Alignment of credit-bearing course offerings. Student learning objectives have been " +
        "mapped out for each of the courses and there is clear progression of learning objectives " +
        "from one course to the next in the sequence.",
      orderIndex: 3, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No clear mapping of student learning objectives.",
        1: "Limited mapping of student learning objectives (e.g., mapping of some SLOs within a course, but not across multiple courses in the sequence).",
        2: "Some mapping of student learning objectives (e.g., mapping of SLOs within a course, but not across multiple courses in the sequence).",
        3: "Clear mapping of student learning objectives within and across courses in the sequence.",
        4: "Comprehensive mapping of student learning objectives within and across courses with detailed documentation; seamless progression from one course to the next.",
      }),
    },
    {
      id: "30000000-0000-0000-0003-000000000004",
      section: "B. Alignment of Introductory Course Offerings",
      prompt:
        "3.B2. Alignment of non-credit-bearing course offerings to support students' success in " +
        "credit-bearing courses.",
      orderIndex: 4, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Little to no alignment between primary and support courses. Students are underprepared for credit-bearing courses.",
        1: "Limited alignment between primary and support courses. Students face challenges in credit-bearing courses.",
        2: "Some alignment of primary and support courses, but may be inconsistent. Students are prepared for some areas of credit-bearing courses, but not all areas.",
        3: "Primary and support courses are well-aligned. Most students are prepared to be successful in credit-bearing courses.",
        4: "Comprehensive mapping of student learning objectives with detailed documentation between primary and support classes. Students in non-credit bearing courses are prepared to be successful in credit bearing courses.",
      }),
    },
    {
      id: "30000000-0000-0000-0003-000000000005",
      section: "B. Alignment of Introductory Course Offerings",
      prompt:
        "3.B3. Mathematics pathways alignment. Getting students into introductory mathematics courses " +
        "that are aligned with the mathematical needs of their chosen (or likely) academic programs " +
        "(called meta-majors).",
      orderIndex: 5, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "There is no attempt to align students' math courses with their intended major.",
        1: "Some meta-majors are aligned with introductory mathematics (e.g., statistics for social sciences) but students in other programs of study still go into the path to calculus.",
        2: "Meta-majors are aligned with mathematics courses, however many students still go into the default course (e.g., College Algebra or Precalculus) no matter what their interests and aspirations.",
        3: "Meta-majors are aligned with mathematics courses. Students are placed into introductory courses by default based on their intended program of study. Constant attention to advising and placement is needed to not revert to prior default placements.",
        4: "Meta-majors are aligned with mathematics courses and students are placed into credit-bearing introductory courses (with co-requisite support if needed) by default based on their intended program of study. Dual credit offerings and enrollments reflect these pathways. All of this is normative practice. Students in the path to Calculus are there because they intend to take Calculus — and throughput for that path is high.",
      }),
    },
  ];

  for (const { section, levelDescriptions, ...fields } of scalesData) {
    await prisma.scale.upsert({
      where: { id: fields.id },
      update: {},
      create: { ...fields, rubricId: rubric.id , section, levelDescriptions },
    });
  }

  const scaleBinPairs = [
    // All scales → Intro Math
    ...scalesData.map((s) => ({ scaleId: s.id, predefinedBinId: BIN_INTRO_MATH })),
    // Partner disciplines → STEM Core
    { scaleId: "30000000-0000-0000-0003-000000000002", predefinedBinId: BIN_STEM_CORE },
    // Pathway alignment → Calculus + Statistics
    { scaleId: "30000000-0000-0000-0003-000000000005", predefinedBinId: BIN_CALCULUS },
    { scaleId: "30000000-0000-0000-0003-000000000005", predefinedBinId: BIN_STATISTICS },
  ];

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 3 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
