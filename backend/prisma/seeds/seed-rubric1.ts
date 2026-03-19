import { prisma } from "@lib/prisma";

// Shared bin IDs — run seed-bins.ts first
const BIN_INTRO_MATH = "20000000-0000-0000-0000-000000000001";
const BIN_STEM_CORE  = "20000000-0000-0000-0000-000000000002";
const BIN_STATISTICS = "20000000-0000-0000-0000-000000000005";

const LEVEL_LABELS: Record<number, string> = {
  0: "Baseline", 1: "Beginning", 2: "Developing", 3: "Accomplished", 4: "Exemplar",
};
function levels(d: Record<number, string>) {
  return Object.fromEntries(
    Object.entries(d).map(([k, v]) => [k, { label: LEVEL_LABELS[Number(k)], description: v }])
  );
}

async function main() {
  // ── Rubric ────────────────────────────────────────────────────────────────
  const rubric = await prisma.rubric.upsert({
    where: { id: "10000000-0000-0000-0000-000000000010" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000010",
      title: "Project EMBER — Rubric 1: Student Success Data (Data Collection Request and 2 criteria)",
      description:
        "Highlights the local data that should be gathered as part of the self-assessment process. " +
        "Any attempt to improve student performance in a course requires the collection of data by " +
        "semester or term over a multi-year period. The purpose is to better understand what problems " +
        "exist — particularly identifying subpopulations that are underperforming.",
      active: true,
    },
  });

  // ── Scales ────────────────────────────────────────────────────────────────
  const scalesData = [
    {
      id: "30000000-0000-0000-0001-000000000001",
      section: "A. Tracking and Using Local Student Data",
      prompt:
        "1.A1. Collecting and utilizing local student data. For each course that is being studied, " +
        "the department tracks multiple types of student data and uses them to identify potential " +
        "issues, particularly identifying subpopulations that are underperforming and that require " +
        "further study to understand why this is happening.",
      orderIndex: 1,
      editable: true,
      isGlobal: false,
      levelDescriptions: levels({
        0: "No data are regularly collected or analyzed for assessment of student success.",
        1: "Student grades are collected by semester or term and coursewide DFW rates are observed for seasonal patterns.",
        2: "The department has begun to track variables such as gender or race that aid in identifying subpopulations that require greater attention.",
        3: "The department tracks a rich set of variables that aid in identifying subpopulations that require greater attention. It has begun to track persistence into and success within subsequent courses.",
        4: "The department is using visualizations of a rich set of student variables collected over a multiyear period that identify potential problems that require further study. It benchmarks its results against comparable institutions. And it investigates downstream effects of its course on various subpopulations.",
      }),
    },
    {
      id: "30000000-0000-0000-0001-000000000002",
      section: "A. Tracking and Using Local Student Data",
      prompt:
        "1.A2. Sharing and discussing local student data. The data that is collected and analyzed " +
        "regarding student outcomes is of little value if it is not shared with the instructors " +
        "teaching the courses and incorporated in discussions between instructors in an effort to " +
        "understand root causes of undesirable outcomes.",
      orderIndex: 2,
      editable: true,
      isGlobal: false,
      levelDescriptions: levels({
        0: "No data are shared with instructors.",
        1: "General data for course outcomes, such as DFW rates, is made easily available but it is not tied to individual terms or able to be disaggregated by student characteristics.",
        2: "Outcome data can be easily accessed by term and instructor but disaggregation/intersection of variable options are limited and faculty conversations are ad-hoc.",
        3: "The department makes all outcome data available to instructors in an aggregated fashion and encourages faculty to discuss ways to minimize unwanted student outcomes.",
        4: "Faculty in the department can regularly access visualizations related to their students' outcomes in the courses they teach as well as monitor overall student outcomes in all lower division courses. Discussions of outcomes and root causes are an expected part of their professional role and are encouraged and structured by the department.",
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

  // ── ScaleBins ─────────────────────────────────────────────────────────────
  const scaleBinPairs = [
    { scaleId: "30000000-0000-0000-0001-000000000001", predefinedBinId: BIN_INTRO_MATH },
    { scaleId: "30000000-0000-0000-0001-000000000001", predefinedBinId: BIN_STEM_CORE },
    { scaleId: "30000000-0000-0000-0001-000000000002", predefinedBinId: BIN_INTRO_MATH },
    { scaleId: "30000000-0000-0000-0001-000000000002", predefinedBinId: BIN_STATISTICS },
  ];

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 1 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
