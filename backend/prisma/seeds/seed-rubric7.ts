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
    where: { id: "10000000-0000-0000-0000-000000000070" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000070",
      title: "Project EMBER — Rubric 7: Instruction & Assessment of Student Learning (9 criteria)",
      description:
        "Assesses the extent to which teaching-focused faculty (TFF) use a variety of instructional " +
        "strategies that reflect the results of research to enhance student learning and the extent " +
        "to which faculty use the results from the ongoing assessment of student learning to guide " +
        "instruction. Effective mathematics instruction requires a variety of resources, materials, " +
        "technology, and forms of assessment.",
      active: true,
    },
  });

  const scalesData = [
    // ── Section A: Pedagogy and the Classroom ─────────────────────────────
    {
      id: "30000000-0000-0000-0007-000000000001",
      section: "A. Pedagogy and the Classroom",
      prompt:
        "7.A1. Focus instruction on active learning and foster student engagement.",
      orderIndex: 1, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Active learning strategies are not used by instructors in the department/team.",
        1: "Active learning strategies, such as think-pair-share, table talks, clickers, etc. that are entry level and most accessible are leveraged when teaching courses in the department/team.",
        2: "Active learning strategies, such as assigning students tasks/worksheets to complete in groups during class, etc. that are intermediate level are leveraged when teaching courses in the department/team.",
        3: "Active learning strategies, such as using guided discovery, group-worthy tasks, student presentations, etc. that are more advanced and geared towards using student thinking to guide instruction are leveraged when teaching courses in the department/team.",
        4: "Active learning strategies, such as engaging students in deep thinking about mathematics, peer-to-peer interaction, instructor attention to and use of student thinking, and instructor use of inclusive teaching practices that are expert level are leveraged when teaching courses in the department/team.",
      }),
    },
    {
      id: "30000000-0000-0000-0007-000000000002",
      section: "A. Pedagogy and the Classroom",
      prompt:
        "7.A2. Mathematical discourse and student collaboration.",
      orderIndex: 2, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Students do not have opportunities to engage in mathematical discourse or collaborate with other students as time in class is solely focused on direct instruction.",
        1: "Students have minimal opportunities to engage in mathematical discourse or collaborate with other students as time in class is mostly focused on direct instruction.",
        2: "Students have some opportunities to engage in mathematical discourse and collaborate with other students as class time includes a roughly even split between direct instruction and student collaboration.",
        3: "Students have many opportunities to engage in mathematical discourse and collaborate with other students. Student thinking is sometimes shared publicly and used to guide instruction. While some direct instruction is used, class time is more heavily focused on student collaboration.",
        4: "Students have significant opportunities to engage in mathematical discourse and collaborate with other students in support of their learning. Students work collaboratively (making ideas public, using vertical whiteboards, etc.) and all students are individually held accountable for understanding the mathematics concepts.",
      }),
    },
    {
      id: "30000000-0000-0000-0007-000000000003",
      section: "A. Pedagogy and the Classroom",
      prompt:
        "7.A3. Teaching with technology.",
      orderIndex: 3, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "TFF do not use appropriate technology in the classroom. Students are not allowed to use technology on assessments.",
        1: "TFF use appropriate technology in their teaching, but the focus of use is on calculations and procedures rather than using technology for deepening learning. Students are not allowed to use technology on assessments.",
        2: "TFF use appropriate technology in their teaching with a mixed focus on calculations and procedures coupled with some use of technology for deepening learning, but the use is limited in scope and students are not allowed to use technology on assessments.",
        3: "TFF use appropriate technology in their teaching with an emphasis more on deepening learning and less on calculations and procedures. Students are encouraged to use technology outside of the classroom and they are allowed to use technology on assessments.",
        4: "TFF use (and encourage students to use) appropriate technology, such as graphing calculators, Desmos, R, Wolfram Alpha, etc., with an extreme emphasis on deepening learning. Students are encouraged to use technology inside and outside of the classroom and they are allowed to use technology on assessments.",
      }),
    },
    // ── Section B: Assessment and Grading ─────────────────────────────────
    {
      id: "30000000-0000-0000-0007-000000000004",
      section: "B. Assessment and Grading",
      prompt:
        "7.B1. Effective use of formative assessments to measure student learning.",
      orderIndex: 4, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "No TFF use formative assessments to measure student learning.",
        1: "Some TFF are beginning to use formative assessments and are sharing their practices with others.",
        2: "Several TFF use formative assessments in their courses, but they typically do not use them to guide instruction. TFF actively promote the use of formative assessment by providing examples and assistance.",
        3: "Many TFF use formative assessments in their courses and use them to guide instruction to a certain extent. They use the assessments to determine alternative ways to approach mathematics to support student success. TFF readily share their practices with others.",
        4: "The majority of TFF use formative assessments in their courses and use them regularly to guide instruction. They use the assessments frequently to determine alternative ways to approach mathematics to support student success. TFF readily share their practices with others.",
      }),
    },
    {
      id: "30000000-0000-0000-0007-000000000005",
      section: "B. Assessment and Grading",
      prompt:
        "7.B2. Effective use of summative assessments to measure student learning.",
      orderIndex: 5, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Each instructor creates their own summative assessments with little or no attempt to align these with departmental/team learning outcomes.",
        1: "Instructors coordinate their summative assessments with some attention to departmental/team learning outcomes.",
        2: "Summative assessments are coordinated with careful attention to the desired departmental/team learning outcomes.",
        3: "There is a departmental/team procedure for assessing summative assessments to ensure alignment with learning outcomes and for providing feedback to instructors on areas where student learning is lagging.",
        4: "Summative assessments are well aligned with departmental/team learning outcomes and there is a regular procedure for using them to identify topics and concepts where students are struggling.",
      }),
    },
    {
      id: "30000000-0000-0000-0007-000000000006",
      section: "B. Assessment and Grading",
      prompt:
        "7.B3. Clarity of learning outcomes and relationship to the MAA's CUPM Curriculum Guide and " +
        "Instructional Practices Guide.",
      orderIndex: 6, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "There are no set departmentally/team learning outcomes for the introductory courses.",
        1: "The department/team has established learning outcomes for introductory courses, but little or nothing is done to monitor instructional alignment with these outcomes.",
        2: "The department/team has begun the process of collecting syllabi, outlines, and course descriptions, but there is no effective process for evaluating them.",
        3: "The department/team regularly evaluates syllabi, outlines, and course descriptions to assess alignment with learning outcomes.",
        4: "The department/team regularly evaluates syllabi, outlines, and course descriptions to assess alignment with learning outcomes and provides useful feedback to instructors.",
      }),
    },
    {
      id: "30000000-0000-0000-0007-000000000007",
      section: "B. Assessment and Grading",
      prompt:
        "7.B4. Alternative grading aligned with innovative teaching.",
      orderIndex: 7, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "The focus of assessing knowledge leverages only traditional grading practices where a progression of learning is not considered. Instead students are graded only on assessments given at fixed times with no opportunity to re-demonstrate knowledge.",
        1: "The focus of assessing knowledge leverages mostly traditional grading practices but some TFF have begun weaving more non-traditional practices, such as allowing students to do exam corrections or retakes without penalty. Introductory mathematics students' course grades are not significantly impacted by their ability to demonstrate their knowledge through these processes.",
        2: "There is a balance between 1) grading practices (traditional and non-traditional) within a given introductory mathematics course as well as 2) the number of TFF who incorporate the mix of grading strategies. Introductory mathematics students' course grades are somewhat impacted by their ability to demonstrate their knowledge through these processes.",
        3: "There is a mix between 1) grading practices (traditional and non-traditional) as well as 2) the number of TFF who incorporate the mix of grading strategies with a heavier lean towards non-traditional practices used by more than half of TFF. The focus is on students' progression of learning, and students have some opportunities to demonstrate their knowledge in a variety of ways. Introductory mathematics students' course grades are significantly impacted by their ability to demonstrate their knowledge through these processes.",
        4: "Alternative grading strategies are widely implemented, accepted, and a celebrated department/team practice in introductory mathematics. In introductory mathematics courses where innovative teaching practices are implemented (e.g., active learning, inquiry-based learning, etc.), students are also being evaluated in ways that align with these practices. The focus is on students' progression of learning over time, and students have multiple opportunities to demonstrate their knowledge in a variety of ways. Introductory mathematics students' course grades are significantly impacted by their ability to demonstrate their knowledge through these processes.",
      }),
    },
    // ── Section C: Student Higher Level Learning ──────────────────────────
    {
      id: "30000000-0000-0000-0007-000000000008",
      section: "C. Student Higher Level Learning",
      prompt:
        "7.C1. Opportunities for inquiry, exploration, and generalization in courses.",
      orderIndex: 8, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Courses do not provide opportunities for inquiry, exploration, and generalization; students have no opportunity to experience the math before formalizing ideas.",
        1: "Courses provide minimal opportunities for inquiry, exploration, and generalization; on occasion, students have opportunities to experience the math before formalizing ideas but teaching is still mostly on presenting facts rather than on students' mathematical thinking.",
        2: "Courses provide some opportunities for inquiry, exploration, and generalization; students have some opportunities to experience the math before formalizing ideas with minimal teaching focused on eliciting student thinking to guide instruction.",
        3: "Courses provide many opportunities for inquiry, exploration, and generalization; students have many opportunities to experience the math before formalizing ideas with some teaching focused on eliciting student thinking to guide instruction.",
        4: "Courses provide significant opportunities for inquiry, exploration, and generalization; students have significant opportunities to experience the math before formalizing ideas with all teaching focused on eliciting student thinking to guide instruction. This way of teaching is the norm in all courses and instructors are guiding instruction based on student experiences and thinking.",
      }),
    },
    {
      id: "30000000-0000-0000-0007-000000000009",
      section: "C. Student Higher Level Learning",
      prompt:
        "7.C2. Student higher-order cognitive processes.",
      orderIndex: 9, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Assignments and assessments across the curriculum are focused on low-level cognitive processes.",
        1: "Assignments and assessments across the curriculum are typically at lower cognitive levels, but a few may require higher-order cognitive processes.",
        2: "Some assignments and assessments across the curriculum require higher-order cognitive processes.",
        3: "Many assignments and assessments across the curriculum require higher-order cognitive processes.",
        4: "Student work at higher cognitive levels is the norm across the curriculum, and instructors are adept at developing assignments and assessments that require higher-order cognitive processes.",
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
    // Active learning and higher-order thinking are relevant to STEM Core broadly
    { scaleId: "30000000-0000-0000-0007-000000000001", predefinedBinId: BIN_STEM_CORE },
    { scaleId: "30000000-0000-0000-0007-000000000008", predefinedBinId: BIN_STEM_CORE },
    { scaleId: "30000000-0000-0000-0007-000000000009", predefinedBinId: BIN_STEM_CORE },
  ];

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 7 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
