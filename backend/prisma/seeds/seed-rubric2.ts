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
    where: { id: "10000000-0000-0000-0000-000000000020" },
    update: {},
    create: {
      id: "10000000-0000-0000-0000-000000000020",
      title: "Project EMBER — Rubric 2: Climate for Transformation (6 criteria)",
      description:
        "Assists introductory mathematics teams in assessing the institutional, administrative, and " +
        "departmental openness to and movement toward change in mathematics education. Although many " +
        "of these criteria are out of the control of departments and faculty, they are critical for " +
        "transformation and sustainability of reform efforts.",
      active: true,
    },
  });

  const scalesData = [
    // ── Section A: Attitude Toward Transformation Initiatives ─────────────
    {
      id: "30000000-0000-0000-0002-000000000001",
      section: "A. Attitude Toward Transformation Initiatives",
      prompt:
        "2.A1. Administrative (e.g., department chair, dean, provost) support for state and national " +
        "transformation initiatives in higher education, with special focus on mathematics education.",
      orderIndex: 1, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Administration is not aware of state and national initiatives or does not acknowledge these initiatives in higher education or mathematics education.",
        1: "Administration is aware of and has read about state and national initiatives in higher education and mathematics education, but no action is taken.",
        2: "Administration supports enacting state and national initiatives in higher education and mathematics education, but no long-term plan or funding is in place.",
        3: "Administration takes action regularly to enact state and national initiatives in higher education and mathematics education, and a short-term action plan is in place.",
        4: "Administration takes action regularly to enact state and national and state initiatives in higher education and mathematics education; administration allocates resources and establishes a long-term action plan.",
      }),
    },
    {
      id: "30000000-0000-0000-0002-000000000002",
      section: "A. Attitude Toward Transformation Initiatives",
      prompt:
        "2.A2. Attitude of teaching-focused faculty (TFF) toward state and national transformation " +
        "initiatives in higher education, with special focus on mathematics education.",
      orderIndex: 2, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "TFF are not aware of state and national initiatives, do not acknowledge these initiatives in higher education or mathematics education, or are antagonistic toward teaching innovations.",
        1: "TFF have read about state and national transformation initiatives in higher education and mathematics education, but do not implement them (i.e., faculty are change averse). Overall faculty opposition to teaching innovations is decreasing.",
        2: "TFF are aware of and discussing state and national transformation initiatives in higher education and mathematics education. Overall faculty opposition to teaching innovations is improving even more.",
        3: "TFF are discussing state and national transformation initiatives in higher education and mathematics education, and establishing short-term action plans.",
        4: "TFF are implementing state and national transformation initiatives in higher education and mathematics education, and establishing long-term action plans.",
      }),
    },
    // ── Section B: Strategies for Promoting Systemic Transformation ────────
    {
      id: "30000000-0000-0000-0002-000000000003",
      section: "B. Strategies for Promoting Systemic Transformation",
      prompt:
        "2.B1. Institutional support for teaching-focused faculty (TFF) to develop and update courses.",
      orderIndex: 3, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Course development and redesign are not recognized as an important activity.",
        1: "Course development and redesign are recognized as important activities, but no incentives or resources are provided.",
        2: "Course development and redesign are recognized as important activities; incentives and resources not defined, are minimal, and are granted infrequently.",
        3: "Course development and redesign are recognized as important activities with well-defined incentives and resources, but funding is not consistently available.",
        4: "Course development and redesign are encouraged and supported. Faculty innovations in teaching are encouraged with substantive incentives and resources provided by policy and/or sustained institutional funding.",
      }),
    },
    // ── Section C: Concrete Implementations Promoting Transformation ───────
    {
      id: "30000000-0000-0000-0002-000000000004",
      section: "C. Concrete Implementations Promoting Transformation",
      prompt:
        "2.C1. Mechanisms for collaborative communication between teaching-focused faculty (TFF) and " +
        "tenure-track faculty on significant educational challenges.",
      orderIndex: 4, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "There is little discussion of educational challenges that impact student success (e.g., retention, persistence, success of underrepresented students).",
        1: "There is informal discussion of educational challenges that impact student success, but discussions include only a limited group of TFF and tenure-track faculty with infrequent, irregular meetings.",
        2: "Informal discussion of educational challenges that impact student success includes the majority of college stakeholders, but there are no mechanisms for collaborative communication.",
        3: "Formal communication mechanism (committees, professional learning community or working groups) exists for discussion of educational challenges that impact student success. The committee includes the majority of TFF and tenure-track faculty.",
        4: "Formal communication mechanism (committees, professional learning community or working groups) exists for discussion of educational challenges that impact student success. The committee includes the majority of TFF and tenure-track faculty, who collaborate actively to make impactful changes.",
      }),
    },
    {
      id: "30000000-0000-0000-0002-000000000005",
      section: "C. Concrete Implementations Promoting Transformation",
      prompt:
        "2.C2. Institutional assessment of student engagement and learning.",
      orderIndex: 5, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "Minimal compliance with what is required for institutional accreditation, but no genuine effort to engage institutional stakeholders in meaningful evaluation of engagement and learning.",
        1: "Most data are derived from indirect satisfaction surveys, and efforts to collect direct evidence on engagement and learning are limited, fragmented or uncoordinated.",
        2: "Some data from both indirect and direct sources are collected, but dissemination of results is limited; these data are used generically for improvement of the student experience.",
        3: "Direct and indirect data are collected with emphasis on direct measures; results are broadly disseminated, and data are used generically for improvement of the student experience.",
        4: "Student engagement and learning is assessed using a mixture of direct and indirect instruments; results are broadly disseminated, and data are used to improve specific outcomes such as persistence and career path success.",
      }),
    },
    {
      id: "30000000-0000-0000-0002-000000000006",
      section: "C. Concrete Implementations Promoting Transformation",
      prompt:
        "2.C3. Formal evaluation of teaching-focused faculty (TFF) and tenure-track faculty with a " +
        "focus on teaching and learning.",
      orderIndex: 6, editable: true, isGlobal: false,
      levelDescriptions: levels({
        0: "There is no connection between evaluation of faculty and improvement of learning.",
        1: "Evaluation of faculty is based on only one or the criteria and has minimal impact for improvement of learning.",
        2: "Evaluation of faculty is based on two of the criteria and some attempt is made to use the data to improve teaching and learning.",
        3: "Evaluation of faculty is based on all three of the criteria and instructors are expected to use the data to improve teaching and learning.",
        4: "Evaluation of faculty is based on all three criteria and a formal structure is in place that helps instructors use data from the different criteria to improve teaching and learning.",
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

  const scaleBinPairs = scalesData.map((s) => ({
    scaleId: s.id,
    predefinedBinId: BIN_INTRO_MATH,
  }));
  // C1 also applies to STEM Core (cross-departmental collaboration)
  scaleBinPairs.push({ scaleId: "30000000-0000-0000-0002-000000000004", predefinedBinId: BIN_STEM_CORE });

  for (const pair of scaleBinPairs) {
    await prisma.scaleBin.upsert({
      where: { scaleId_predefinedBinId: pair },
      update: {},
      create: pair,
    });
  }

  console.log(`Rubric 2 seed complete — ${scalesData.length} scales`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
