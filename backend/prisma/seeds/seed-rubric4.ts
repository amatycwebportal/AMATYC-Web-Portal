import { prisma } from "@lib/prisma";

const BIN_INTRO_MATH = "20000000-0000-0000-0000-000000000001";
const BIN_STEM_CORE  = "20000000-0000-0000-0000-000000000002";

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
    where: { id: "10000000-0000-0000-0000-000000000040" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000040",
      title: "Project EMBER — Rubric 4: Student Support (6 criteria)",
      description:
        "Assesses the extent to which the introductory mathematics team and their institutions " +
        "create an environment that optimizes mathematics learning for all students. Focus areas: " +
        "effective placement and advisement, opportunities for supplemental assistance and " +
        "experiential learning, building community among students, and coordination of tutoring support.",
      active: true,
    },
  });

  const scalesData = [
    // ── Section A: Effective Placement and Advisement ─────────────────────
    {
      id: "30000000-0000-0000-0004-000000000001",
      section: "A. Effective Placement and Advisement",
      prompt:
        "4.A1. The Department/Introductory Mathematics Team has an effective system for placing " +
        "students in the appropriate mathematics course(s) based on their intended pathway.",
      orderIndex: 1, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department/team does not have a structured placement system for mathematics courses.",
        1: "The department/team has a basic placement system but relies on a single data point (e.g. a single placement test, high school GPA, or ACT/SAT scores). There is no periodic review of placement procedures.",
        2: "The department/team uses multiple data points for placing students in mathematics courses. There is no periodic review of the effectiveness of placement procedures.",
        3: "The department/team uses multiple data points for placing students in mathematics courses. Placement procedures are reviewed periodically, but the process is not systematic.",
        4: "The department/team has an effective placement system that uses multiple data points. The department conducts systematic and periodic reviews of placement procedures to ensure accurate placement. Feedback from students and faculty is used to refine the placement process.",
      }),
    },
    {
      id: "30000000-0000-0000-0004-000000000002",
      section: "A. Effective Placement and Advisement",
      prompt:
        "4.A2. The Department/Introductory Mathematics Team coordinates and collaborates with " +
        "advisors on initial course placement.",
      orderIndex: 2, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department/team and advisors do not coordinate or collaborate. Advisement occurs in a silo.",
        1: "The department/team and advisors collaborate infrequently on matters pertaining to initial course placement, but advisement still tends to occur in a silo.",
        2: "The department/team and advisors coordinate and collaborate occasionally with a shared interest in placing students appropriately. Progress is being made where advisement occurs in conjunction with the department/team.",
        3: "The department/team and advisors coordinate and collaborate frequently with a shared interest in placing students appropriately. Advisors are knowledgeable of the needs of the department/team.",
        4: "The department/team and advisors regularly coordinate and collaborate to implement best practices for placing students into their initial math course. Advisors feel well-informed by the department/team and understand the needs of the department/team and students for placement.",
      }),
    },
    // ── Section B: Opportunities for Supplemental Assistance ─────────────
    {
      id: "30000000-0000-0000-0004-000000000003",
      section: "B. Opportunities for Supplemental Assistance",
      prompt: "4.B1. Accessibility of supplemental assistance for student success.",
      orderIndex: 3, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Supplemental assistance opportunities are absent.",
        1: "One or two supplemental assistance opportunities are offered, but accessible to few students.",
        2: "Supplemental assistance opportunities are diverse, but only accessible to some students.",
        3: "Supplemental assistance opportunities are diverse and widely accessible to many students.",
        4: "Supplemental assistance opportunities are diverse, widely accessible to all students, and institutionalized by permanent funding.",
      }),
    },
    {
      id: "30000000-0000-0000-0004-000000000004",
      section: "B. Opportunities for Supplemental Assistance",
      prompt:
        "4.B2. Mathematics tutoring is coordinated with the needs and efforts of the " +
        "department/introductory mathematics team.",
      orderIndex: 4, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department/team has little or no awareness of what is happening with tutoring services.",
        1: "Mathematics tutoring is not coordinated between tutoring services and the department/team. The department is only vaguely aware of what is happening in the tutoring services.",
        2: "Mathematics tutoring efforts are lightly coordinated between tutoring services and the department/team, yet efforts to collect and/or share student utilization data are not yet in place.",
        3: "Mathematics tutoring efforts are coordinated between tutoring services and the department/team. Efforts to collect and/or share student utilization data are emerging.",
        4: "Mathematics tutoring is fully and intentionally coordinated with the needs and efforts of the department/team. Data on student utilization — including specific students tied to specific courses — are shared with the department/team so faculty are aware of which students are using tutoring services.",
      }),
    },
    {
      id: "30000000-0000-0000-0004-000000000005",
      section: "B. Opportunities for Supplemental Assistance",
      prompt:
        "4.B3. Sharing of data regarding student participation in supplemental assistance opportunities.",
      orderIndex: 5, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No data on student participation in supplemental assistance is collected and thus there is no communication between the department/team and student support units regarding student usage.",
        1: "Data is collected on student participation in supplemental assistance, but not regularly shared with the department/team. Data is available upon request but may be in a format that is not helpful.",
        2: "A report is regularly shared (e.g., end of term or academic year) with the department/team from the support unit(s) regarding student and course usage, but the report is not customizable and might not be as helpful as desired.",
        3: "In addition to the regular report from student support unit(s), data is disaggregated and shared with the department/team in various ways to identify potential student groups in specific courses that may need additional support.",
        4: "There is regular data-informed communication between the department/team and student support unit(s) about student usage so that targets for improvement can be set for specific student groups in specific courses. Data is disaggregated in various ways and regularly examined by both the department/team and student support unit to inform improvement decisions.",
      }),
    },
    // ── Section C: Building Community Among Students ──────────────────────
    {
      id: "30000000-0000-0000-0004-000000000006",
      section: "C. Building Community Among Students",
      prompt:
        "4.C1. The Department/Introductory Mathematics Team works to build students' sense of " +
        "belonging and community.",
      orderIndex: 6, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Minimal or no effort to foster a sense of community among students.",
        1: "Limited or sporadic efforts to build community among students. Efforts may be limited to individual instructors and their own classes.",
        2: "Moderate efforts to foster belonging and community among students. Some student feedback is gathered to learn about students' sense of belonging, but the feedback is not used to improve initiatives.",
        3: "Consistent and effective efforts to build a sense of belonging and community among students. Community-building is integrated into more core courses. Student feedback is regularly sought and used to improve initiatives.",
        4: "Consistent and effective efforts to build a sense of belonging and community among students. Community-building is embedded across the department/team. Student feedback is consistently gathered, analyzed, and acted upon to enhance community-building strategies.",
      }),
    },
  ];

  for (const { section, levelDescriptions, ...fields } of scalesData) {
    await prisma.scale.upsert({
      where: { id: fields.id },
      update: {},
      create: {
        ...fields,
        rubricId: rubric.id,
        section,
        levelDescriptions,
      },
    });
  }

  const scaleBinPairs = [
    ...scalesData.map((s) => ({ scaleId: s.id, predefinedBinId: BIN_INTRO_MATH })),
    // Community building (C1) also applies to STEM Core
    { scaleId: "30000000-0000-0000-0004-000000000006", predefinedBinId: BIN_STEM_CORE },
  ];

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 4 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());