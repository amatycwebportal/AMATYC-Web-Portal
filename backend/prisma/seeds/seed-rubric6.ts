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
    where: { id: "10000000-0000-0000-0000-000000000060" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000060",
      title: "Project EMBER — Rubric 6: Instructor Professional Development (5 criteria)",
      description:
        "Assesses the extent to which professional development is provided to new and seasoned college " +
        "mathematics teaching-focused faculty (TFF) across all the various instructional ranks, " +
        "including graduate student instructors. Professional learning should be supported by the " +
        "department/introductory mathematics team and institution, and embraced by TFF.",
      active: true,
    },
  });

  const scalesData = [
    // ── Section A: Department/Intro Math Team Support and Professional Development
    {
      id: "30000000-0000-0000-0006-000000000001",
      section: "A. Department/Intro Math Team Support and Professional Development",
      prompt:
        "6.A1. The department/introductory mathematics team offers ongoing, quality professional " +
        "development for new teaching-focused faculty (TFF), including graduate student instructors.",
      orderIndex: 1, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department/team does not provide any specific TFF orientation activities to new faculty (and graduate students), nor do they provide any information regarding values and practices about teaching in the department.",
        1: "The department/team offers a mandatory, single-session orientation session around teaching that is required for new TFF (and graduate students). While the session is offered, there is little to no ongoing professional development to support new TFF.",
        2: "The department/team offers orientation that exceeds the mandatory single session. Some additional non-mandatory opportunities for the development of teaching skills are available for new TFF (and graduate students) through department/team professional development.",
        3: "The department/team offers multiple, formal orientation and professional development sessions around teaching that are mandatory for new TFF (and graduate students), throughout their first year.",
        4: "The department/team offers multiple, formal orientation and professional development sessions around teaching that are mandatory for new TFF (and graduate students), throughout their first year. New TFF (and graduate students) have access to (and are encouraged to engage with) individualized support from the department/team to meet their needs in growing as a teacher.",
      }),
    },
    {
      id: "30000000-0000-0000-0006-000000000002",
      section: "A. Department/Intro Math Team Support and Professional Development",
      prompt:
        "6.A2. The department/introductory mathematics team offers quality mentoring for new " +
        "teaching-focused faculty (TFF), including graduate student instructors.",
      orderIndex: 2, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Mentoring for new TFF (and graduate students) of any type is unplanned and not formally organized by the department/team. There are no mentors officially assigned to new TFF, but there could be TFF in the department/team that informally serve as mentors.",
        1: "The department/team does only one of the following: (1) provides mentoring for new TFF (and graduate students) through planned, informal activities, or (2) assigns an official mentor to TFF.",
        2: "The department/team does both of the following: (1) provides mentoring for new TFF (and graduate students) through planned, informal activities, and (2) assigns an official mentor to TFF.",
        3: "The department/team does both of the following: (1) provides mentoring for new TFF (and graduate students) through planned informal activities and formal activities, and (2) assigns an official mentor to the TFF. The mentor takes an active role in supporting their mentee. The mentor and mentee meet regularly.",
        4: "The department/team does both of the following: (1) provides mentoring for new TFF (and graduate students) through planned informal and formal activities, and (2) assigns an official mentor to TFF. The mentor takes an active role in providing teaching-focused support for their mentee (e.g., observes each other's teaching, attend teaching-focused conference-type events together, read articles and discuss). The mentor and mentee meet regularly to discuss teaching and ways to grow in teaching.",
      }),
    },
    {
      id: "30000000-0000-0000-0006-000000000003",
      section: "A. Department/Intro Math Team Support and Professional Development",
      prompt:
        "6.A3. The department/introductory mathematics team organizes learning communities to support " +
        "teaching-focused faculty (TFF), including graduate students, implementation of evidence-based practices.",
      orderIndex: 3, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No TFF (or graduate students) participate in a learning community and evidence-based practices are rarely discussed.",
        1: "There is no learning community, but there are occasional discussions around pedagogy.",
        2: "At least one learning community has been formed and some TFF participate.",
        3: "One (or more) learning communities have been formed and many TFF participate.",
        4: "A learning community has been formed and a significant majority of TFF (and graduate students) participate in discussions about teaching and share their work with each other.",
      }),
    },
    // ── Section B: Teaching-Focused Faculty Engagement in Professional Development
    {
      id: "30000000-0000-0000-0006-000000000004",
      section: "B. Teaching-Focused Faculty Engagement in Professional Development",
      prompt:
        "6.B1. Teaching-focused faculty (TFF) engagement at conferences or other professional " +
        "development opportunities in mathematics education.",
      orderIndex: 4, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "TFF do not attend conferences or workshops related to reform efforts in undergraduate STEM education.",
        1: "A small number of TFF actively participate in national conferences and other professional development opportunities focused on curricular reform and improving teaching and learning.",
        2: "Some TFF actively participate in national conferences and other professional development opportunities focused on curricular reform and improving teaching and learning.",
        3: "Many TFF actively participate in national conferences and other professional development opportunities focused on curricular reform and improving teaching and learning.",
        4: "A significant majority of TFF regularly participate in national conferences and other professional development opportunities focused on curricular reform and improving teaching and learning, and participate in dialogue on STEM reform.",
      }),
    },
    // ── Section C: Effectiveness of Departmental Support and Professional Development
    {
      id: "30000000-0000-0000-0006-000000000005",
      section: "C. Effectiveness of Departmental Support and Professional Development",
      prompt:
        "6.C1. The department/introductory mathematics team evaluates the effectiveness of " +
        "professional development activities.",
      orderIndex: 5, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No process for reviewing the effectiveness of professional development activities are used.",
        1: "Some informal or ad hoc processes are in place for reviewing the effectiveness of professional development activities. Although mechanisms exist to collect and examine data, it is not data intended for the purpose of evaluating professional development activities for improvements in teaching.",
        2: "Basic processes are established for reviewing the effectiveness of professional development activities. While the department/team may be examining existing data, they also collect data for the purpose of evaluating professional development activities. However, these efforts are limited in scope and lack a clear framework for analyzing results or making improvements.",
        3: "A comprehensive system to consider the effectiveness of professional development activities is in place. The department/team uses a robust, multi-faceted approach for the purpose of evaluating professional development activities. However, data is not leveraged to make improvements to the professional development activities.",
        4: "A comprehensive system to consider the effectiveness of professional development activities is in place. The department/team uses a robust, multi-faceted approach for the purpose of evaluating professional development activities. Data is used to strategically refine and enhance the effectiveness of professional development activities.",
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
    ...scalesData.map((s) => ({ scaleId: s.id, predefinedBinId: BIN_INTRO_MATH })),
    // Conference engagement is cross-cutting to all STEM Core faculty
    { scaleId: "30000000-0000-0000-0006-000000000004", predefinedBinId: BIN_STEM_CORE },
  ];

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 6 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
