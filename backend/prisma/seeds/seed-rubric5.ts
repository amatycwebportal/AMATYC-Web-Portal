import { prisma } from "@lib/prisma";

const BIN_INTRO_MATH = "20000000-0000-0000-0000-000000000001";
const BIN_STEM_CORE  = "20000000-0000-0000-0000-000000000002";

const RUBRIC_VERSION_ID = "10000000-0000-0000-0005-000000000001";

const SCALE_VERSION_IDS: Record<string, string> = {
  "30000000-0000-0000-0005-000000000001": "40000000-0000-0000-0005-000000000001",
  "30000000-0000-0000-0005-000000000002": "40000000-0000-0000-0005-000000000002",
  "30000000-0000-0000-0005-000000000003": "40000000-0000-0000-0005-000000000003",
  "30000000-0000-0000-0005-000000000004": "40000000-0000-0000-0005-000000000004",
  "30000000-0000-0000-0005-000000000005": "40000000-0000-0000-0005-000000000005",
  "30000000-0000-0000-0005-000000000006": "40000000-0000-0000-0005-000000000006",
  "30000000-0000-0000-0005-000000000007": "40000000-0000-0000-0005-000000000007",
  "30000000-0000-0000-0005-000000000008": "40000000-0000-0000-0005-000000000008",
  "30000000-0000-0000-0005-000000000009": "40000000-0000-0000-0005-000000000009",
};

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
    where: { id: "10000000-0000-0000-0000-000000000050" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000050",
      title: "Project EMBER — Rubric 5: Course Coordination & Curriculum Materials (9 criteria)",
      description:
        "Assesses whether introductory mathematics teams are leveraging course coordination as a " +
        "means for improving the teaching and learning of mathematics and assesses the extent to " +
        "which course coordination is integrated into the work of the department/team. This also " +
        "includes the extent to which faculty have been thoughtfully positioned in their roles as " +
        "course coordinators, TA trainers and professional development providers, and other relevant roles.",
      active: true,
    },
  });

  const scalesData = [
    // ── Section A: The Role of Course Coordinators ────────────────────────
    {
      id: "30000000-0000-0000-0005-000000000001",
      section: "A. The Role of Course Coordinators",
      prompt:
        "5.A1. The department/introductory mathematics team has defined roles and responsibilities " +
        "for course coordinators.",
      orderIndex: 1, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The role and responsibilities for course coordinators are not defined or there are no coordinated courses offered.",
        1: "The role and responsibilities for course coordinators are informally defined.",
        2: "The role and responsibilities for course coordinators are becoming more formally defined. Course coordinators are generally aware of these responsibilities.",
        3: "The role and responsibilities for course coordinators are formally defined. Course coordinators are aware of these responsibilities.",
        4: "The role and responsibilities for course coordinators is well-defined. The course coordinators are aware of their defined role and responsibilities and they play a role in defining these roles and responsibilities.",
      }),
    },
    {
      id: "30000000-0000-0000-0005-000000000002",
      section: "A. The Role of Course Coordinators",
      prompt:
        "5.A2. The department/introductory mathematics team provides resources to support course coordinators.",
      orderIndex: 2, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department/team does not support course coordinators and does not provide incentives for their role.",
        1: "The department/team supports course coordinators informally, but there are no established mechanisms for support (e.g., course release) or incentives.",
        2: "The department/team formally supports course coordinators professionally (e.g., funding for professional development).",
        3: "The support provided to course coordinators by the department/team matches the time commitment required for them to fulfill their responsibilities, and includes formal structures or policies to ensure this consistency.",
        4: "The department/team fully supports course coordinators professionally (e.g., funding for professional development) and financially through mechanisms that allow for sustainability of course coordination and the support provided to course coordinators by the department/team matches the time commitment required for them to fulfill their responsibilities, and includes formal structures or policies to ensure this consistency.",
      }),
    },
    {
      id: "30000000-0000-0000-0005-000000000003",
      section: "A. The Role of Course Coordinators",
      prompt:
        "5.A3. Process for onboarding, rotating, and sustaining consistency between course coordinators.",
      orderIndex: 3, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The department/team does not have a process for onboarding or rotating faculty to serve as course coordinators.",
        1: "The department/team recognizes the need for a process to onboard and rotate course coordinators, but the process is not established yet.",
        2: "The department/team is establishing a process for onboarding and rotating faculty as course coordinators, but many components of the plan are under developed.",
        3: "The department/team has established a process for onboarding and rotating faculty as course coordinators but this process varies (e.g., by course, timeline, etc.).",
        4: "The department/team has an established process for onboarding and rotating faculty as course coordinators and that process is consistent.",
      }),
    },
    {
      id: "30000000-0000-0000-0005-000000000004",
      section: "A. The Role of Course Coordinators",
      prompt:
        "5.A4. Empowering teaching-focused faculty (TFF) to be change agents.",
      orderIndex: 4, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "TFF are either never assigned to be course coordinators or, when they are, they are not given the same agency and respect as tenured or tenure-track faculty in these positions.",
        1: "The department/team regularly assigns TFF as course coordinators and gives them some authority over coordinating how the course should be taught.",
        2: "The department/team regularly assigns TFF as course coordinators and gives them moderate authority to coordinate the various aspects of the course, though their voices are not always heard or ideas respected fully.",
        3: "The department/team regularly assigns TFF as course coordinators and gives them authority to shape some components of the course, but not all components.",
        4: "The department/team recognizes and respects the expertise that TFF bring as course coordinators and gives them full authority to shape the content, structure, and pedagogy of the course.",
      }),
    },
    // ── Section B: Course Logistics and Pedagogical Research-Based Practices
    {
      id: "30000000-0000-0000-0005-000000000005",
      section: "B. Course Logistics and Pedagogical Research-Based Practices",
      prompt:
        "5.B1. Coordination of course logistics and facilitate the sharing of course materials.",
      orderIndex: 5, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Coordination of course logistics is minimal or inconsistent. There is no effort to encourage sharing of resources among TFF.",
        1: "Basic coordination of course logistics is provided (e.g., basic course shell in LMS, some selected homework tasks). Some course resources are available, but they may be incomplete or not well-organized. There is limited encouragement for TFF to share resources.",
        2: "Course logistics are generally well-coordinated (e.g., common syllabus, well-maintained course shell in LMS, selected homework tasks and common exams are provided). There is some encouragement and support for TFF to share resources.",
        3: "Course logistics are well-coordinated. Comprehensive course resources are mostly aligned with evidence-based practices, are available, and well-organized. TFF are actively encouraged and supported in sharing resources.",
        4: "Course logistics are effectively coordinated. All course resources are carefully curated, consistently updated, and aligned with evidence-based practices. There is an established mechanism for sharing resources and a strong culture among TFF, facilitated by the course coordinator.",
      }),
    },
    {
      id: "30000000-0000-0000-0005-000000000006",
      section: "B. Course Logistics and Pedagogical Research-Based Practices",
      prompt:
        "5.B2. Provide instructional learning (e.g., pedagogical support, course materials, leadership, " +
        "work with TAs) to implement evidence-based practices in mathematics education.",
      orderIndex: 6, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No instructional learning opportunities provided.",
        1: "Minimal instructional learning opportunities, with minimal attention to student thinking and experiences, provided and rates of instructor participation are low/highly variable.",
        2: "Basic periodic instructional learning opportunities provided and instructor participation is moderate/moderately variable. Common student ways of thinking and experiences are recognized and discussed with instructors.",
        3: "Regular instructional support opportunities are provided, including a focus on common student ways of thinking and experiences. Instructor participation is high and consistent over time.",
        4: "Strong and regular instructional learning opportunities provided. Instructor participation is (nearly) universal and consistent over time. There is a thorough understanding of student ways of thinking and experiences.",
      }),
    },
    // ── Section C: Impact of Course Coordination ──────────────────────────
    {
      id: "30000000-0000-0000-0005-000000000007",
      section: "C. Impact of Course Coordination",
      prompt:
        "5.C1. Periodic observation of coordinated classrooms and meetings of instructors.",
      orderIndex: 7, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "There is no course coordinator for large multi-section courses.",
        1: "The course coordinator has a clear vision for how the sections should be run and communicates that effectively to the individual instructors.",
        2: "In addition to the vision that is communicated to the instructors, the course coordinator regularly visits the individual sections and provides feedback to the instructors.",
        3: "There is recognition by individual instructors of the role of the course coordinator and a strong sense of collegiality among coordinator and instructors in sharing best practices and understanding what is happening within each section.",
        4: "The department as a whole is aware of how the coordinator and the individual instructors are working collaboratively to improve classroom instruction, and all faculty, including the senior faculty, support and encourage these efforts.",
      }),
    },
    {
      id: "30000000-0000-0000-0005-000000000008",
      section: "C. Impact of Course Coordination",
      prompt:
        "5.C2. Collecting feedback from instructors and students.",
      orderIndex: 8, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "There are no formal structures in place for evaluating the effectiveness of the course coordination.",
        1: "There is some formal mechanism in place for gathering feedback from the instructors in the individual sections.",
        2: "There is at least one formal mechanism in place for gathering feedback from instructors and a formal means which could be interviews, surveys, or focus groups for gathering feedback from students.",
        3: "Some form of formal observation protocol is used to understand what is happening in the individual sections, and there are other regular and formal means of collecting feedback from instructors and students.",
        4: "The results of the formal feedback mechanisms from both instructors and students are made available in aggregated form for consideration and the gathering of feedback from the TFF as a whole.",
      }),
    },
    {
      id: "30000000-0000-0000-0005-000000000009",
      section: "C. Impact of Course Coordination",
      prompt:
        "5.C3. Collecting and utilizing student outcome data.",
      orderIndex: 9, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Data on a given course is neither regularly collected nor analyzed for assessment of student success.",
        1: "Student grades in the given course are regularly examined and trends are considered.",
        2: "In addition to grades, other measures of student understanding and confidence are regularly collected and assessed.",
        3: "In addition to grades and other measures of student understanding, the department/team tracks persistence into and success within subsequent courses.",
        4: "The department/team tracks, analyzes, and spends time considering the implications of multiple measures that inform how well the specific course fits into the overall instructional progression of which it forms a critical step. This includes identifying significant subpopulations such as women or students from under-resourced schools for whom improvements could be made.",
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
    // TFF empowerment and cross-section collaboration also relevant to STEM Core
    { scaleId: "30000000-0000-0000-0005-000000000004", predefinedBinId: BIN_STEM_CORE },
    { scaleId: "30000000-0000-0000-0005-000000000007", predefinedBinId: BIN_STEM_CORE },
  ];

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }
  await prisma.rubricVersion.upsert({
    where: { id: RUBRIC_VERSION_ID },
    update: {},
    create: {
      id: RUBRIC_VERSION_ID,
      rubricId: rubric.id,
      versionNum: 1,
      changelog: "Initial version",
    },
  });


  for (const { section, levelDescriptions, ...fields } of scalesData) {
    await prisma.scaleVersion.upsert({
      where: { id: SCALE_VERSION_IDS[fields.id] },
      update: {},
      create: {
        id:               SCALE_VERSION_IDS[fields.id],
        rubricVersionId:  RUBRIC_VERSION_ID,
        originalScaleId:  fields.id,
        prompt:           fields.prompt,
        orderIndex:       fields.orderIndex,
        isGlobal:         fields.isGlobal,
        editable:         fields.editable,
        section,
        levelDescriptions,
      },
    });
  }

  const scaleVersionBinPairs = [
    ...scalesData.map((s) => ({
      scaleVersionId: SCALE_VERSION_IDS[s.id],
      predefinedBinId: BIN_INTRO_MATH,
    })),
    {
      scaleVersionId: SCALE_VERSION_IDS["30000000-0000-0000-0005-000000000004"],
      predefinedBinId: BIN_STEM_CORE,
    },
    {
      scaleVersionId: SCALE_VERSION_IDS["30000000-0000-0000-0005-000000000007"],
      predefinedBinId: BIN_STEM_CORE,
    },
  ];
  

  for (const pair of scaleVersionBinPairs) {
    await prisma.scaleVersionBin.upsert({
      where: { scaleVersionId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 5 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
