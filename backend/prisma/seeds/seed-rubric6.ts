import { prisma } from "@lib/prisma";
import { seedSnapshotRubric } from "./seedSnapshotRubric";

// Source: Word Documents/6 2023 Professionalism.docx
seedSnapshotRubric({
  rubricId: "10000000-0000-0000-0000-000000000060",
  rubricVersionId: "10000000-0000-0000-0006-000000000001",
  title: "Teaching for PROWESS — Rubric 6: Professionalism (10 criteria)",
  description: "Please read the entire Introduction before completing the Rubric\n\nThe Teaching for PROWESS (TfP) Vision & Transformation Catalyst Tool* is a diagnostic tool designed to be used in a self-study to evaluate the implementation of the recommendations of the AMATYC Standards (referring to Crossroads in Mathematics, Beyond Crossroads, and IMPACT in mathematics departments. The work is based on the extensive work of Partnership for Undergraduate Life Science Education (PULSE)** which was focused on Biology in 4-year institutions. They have been modified based on the features expected in a 2-year college math department that has fully implemented all of the AMATYC recommendations. They are meant as tools to highlight the areas where departments stand out and areas where departments have made less progress.\n\nThe complete Teaching for PROWESS Vision & Transformation Catalyst Tool contains 8 rubrics:\n\n1) Student Learning and the Learning Environment, 2) Instruction, 3) Curriculum and Program Development, 4) Assessment of Student Learning, 5) Diversity, Equity, and Inclusion, 6) Professionalism, 7) Climate for Transformation and 8) Snapshot.\n\nTerminology: The rubrics can be used to evaluate individual departments, or a division composed of mathematics faculty (either full-time or part-time) which will be referred to as ‘departments’ in this document. The use of the term ‘faculty’ throughout the rubrics is meant as a generic term for the range of possible titles for all those who are instructors in any course that is part of the department being evaluated.\n\nProcedure: Once a department chooses an area, or areas, they would like to examine, the faculty should then individually determine scores for the rubrics. Each criterion begins with a CONTEXT section that should be read prior to reading the criterion’s descriptors. Once a score for a criterion is determined it is important to document the justification in the appropriate section of the table. After the individual results are completed, the department should determine and report a consensus score for each criterion. For more information and suggestions on completing this process, refer to the Rubric FAQs on the teachingforprowess.wordpress.com website.\n\n* This material is based upon work supported by the National Science Foundation under Grants No. 2012962, 2013232, 2013493, 2013550. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.\n\n** An initiative launched by the National Science Foundation (NSF), the Howard Hughes Medical Institute (HHMI), and the National Institute for General Medical Sciences (NIGMS/NIH).\n\nRubric V- Professionalism (9 criteria)\n\nThis rubric assesses the extent to which institutions hire qualified, diverse mathematics faculty, and support these faculty as they engage in ongoing professional development and service. Institutions should be proactive in recruiting candidates with diverse backgrounds and hiring qualified mathematics faculty. These faculty need to continually expand their mathematics knowledge, stay current with new research on learning and teaching, and be active in the college and the profession. The institution should support mathematics faculty by providing opportunities for faculty to learn and grow in their profession. Categories include: A) Faculty Engagement, B) Faculty Implementation, and C) Institutional Support.",
  criteria: [
    {
      id: "30000000-0000-0000-0006-000000000001",
      scaleVersionId: "40000000-0000-0000-0006-000000000001",
      section: "A. FACULTY ENGAGEMENT",
      orderIndex: 1,
      prompt: "CRITERION A1: Awareness of national efforts in undergraduate STEM education reform\n\nCONTEXT: This criterion addresses the degree to which faculty members are aware of national efforts such as reports on mathematics/statistics and STEM education (such as Common Vision for Undergraduate Mathematical Sciences Programs in 2025, Guidelines for Assessment and Instruction in Statistical Education (GAISE), Conference Board of the Mathematics Sciences (CBMS) position statement on active learning, and the seminal 2012 Engage to Excel PCAST report). Are faculty members interested and aware that these reports support making their classrooms student-focused and inquiry-based? Are faculty aware and willing to consider that there is strong evidence from educational and cognitive science studies that student-centered teaching strategies are more effective for learning than lecture-based teaching?\n\nIn order to achieve the goals of these national reports, faculty will need significant professional development. Are faculty members aware of summer institutes, workshops and other professional development related to the reform efforts?",
      levels: {
        0: "Faculty are isolated from the national dialogue",
        1: "Few faculty are aware of reform and national efforts in undergraduate STEM education",
        2: "Some faculty are aware of reform and national efforts in undergraduate STEM education",
        3: "Many the faculty are aware of reform and national efforts in undergraduate STEM education",
        4: "Most faculty are aware of reform and national efforts in undergraduate STEM education",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000002",
      scaleVersionId: "40000000-0000-0000-0006-000000000002",
      section: "A. FACULTY ENGAGEMENT",
      orderIndex: 2,
      prompt: "CRITERION A2: Awareness and implementation of discipline-based education research (DBER)\n\nCONTEXT: This criterion addresses a deeper knowledge about mathematics and STEM education research and use of this knowledge to improve teaching and learning. Discipline-based Education Research (DBER) includes peer-reviewed studies that assess the effectiveness of various pedagogical approaches and theories. Scholarly teaching (also called scientific teaching) is the practice of evaluating whether students achieve learning goals and reflecting on teaching practice to continuously improve student learning.",
      levels: {
        0: "Faculty are unaware of DBER and its utility or are aware but do not implement it",
        1: "Few faculty use DBER findings to inform teaching practice",
        2: "Some faculty use DBER findings to inform teaching practice",
        3: "Many faculty use DBER findings to inform teaching practice",
        4: "Most faculty use DBER findings to inform teaching practice",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000003",
      scaleVersionId: "40000000-0000-0000-0006-000000000003",
      section: "A. FACULTY ENGAGEMENT",
      orderIndex: 3,
      prompt: "CRITERION A3: Faculty engagement at conferences and other professional development opportunities related to STEM education reform\n\nCONTEXT: This criterion addresses the extent of faculty member professional development and engagement with education reform. Examples of events that faculty members might attend, focused on mathematics education and its reform, include AMATYC, ASA, MAA, NCTM, etc. This is not an exhaustive list as there are many other regional and national conferences, meetings, and workshops focused on mathematics undergraduate education.",
      levels: {
        0: "Faculty do not attend conferences or workshops related to reform",
        1: "A small number of faculty actively participate in national conferences and other professional development opportunities",
        2: "Some faculty actively participate in national conferences and other professional development opportunities",
        3: "Many faculty actively participate in national conferences and other professional development opportunities",
        4: "A significant majority of faculty regularly actively participate in national conferences and other professional development opportunities and participate in dialogue on STEM reform",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000004",
      scaleVersionId: "40000000-0000-0000-0006-000000000004",
      section: "B. FACULTY IMPLEMENTATION",
      orderIndex: 4,
      prompt: "CRITERION B1: Use of a learning community to support faculty implementation of evidence-based practices\n\nCONTEXT: This criterion is focused on the creation of a community of practice or learning community that provides an opportunity for faculty to share and discuss evidence-based practices, data, student work, and active learning tasks. The learning community could also support classroom observations, lesson study, etc. Sharing could include formal opportunities such as Teaching & Learning Center workshops on mathematics teaching and department meetings or retreats dedicated to sharing pedagogical ideas and outcomes. Informal sharing opportunities are also important, such as brown bag discussions between and among faculty members about pedagogical approaches.",
      levels: {
        0: "No faculty participate in a learning community and evidence-based practices are rarely discussed.",
        1: "There is no learning community, but there are occasional discussions around pedagogy.",
        2: "A learning community has been formed and some faculty participate.",
        3: "A learning community has been formed and many faculty participate.",
        4: "A learning community has been formed and a significant majority of faculty participate in discussions and share their work with each other.",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000005",
      scaleVersionId: "40000000-0000-0000-0006-000000000005",
      section: "B. FACULTY IMPLEMENTATION",
      orderIndex: 5,
      prompt: "CRITERION B2: Alignment of pedagogical approaches with evidence-based practices\n\nCONTEXT: This criterion is focused on the use of evidence-based practices in student learning. Two factors are being assessed here: first, the degree to which student-centered approaches are used in the classroom and second, the proportion of faculty members who are using these approaches. There is a wide range of student-centered approaches including flipped classrooms, mixed modality, and active learning. To support claims of extensive use of evidence-based pedagogy, scoring of active learning using classroom observation tools (such as Observation Protocol for Active Learning (OPAL)) would be required to justify a score of 4.",
      levels: {
        0: "Lecturing without student engagement is the dominant practice in all courses",
        1: "Evidence-based pedagogies are used by one or few instructors",
        2: "A core group of faculty are shifting department attitudes and practices toward more widespread use of evidence-based pedagogies, although courses in which students experience uninterrupted lecture are common",
        3: "Nearly all faculty are learning about and experimenting with evidence-based pedagogical practices, although courses in which students experience uninterrupted lecture are common",
        4: "The departmental norm is for faculty to routinely use evidence- based practices, so that students rarely sit passively listening to lectures for an entire class session",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000006",
      scaleVersionId: "40000000-0000-0000-0006-000000000006",
      section: "B. FACULTY IMPLEMENTATION",
      orderIndex: 6,
      prompt: "CRITERION B3: Alignment of learning goals, learning activities, and assessments\n\nCONTEXT: This criterion pertains to the degree to which instructors have intentionally aligned their learning goals, activities, and assessments. These should be tied to a department vision that exemplifies national reform efforts. One possible strategy for such alignment is ‘backward design.’ With backward design first establish learning goals informed by the vision. Next develop measures that demonstrate that the learning goals were met. Finally, design activities so students can meet these learning goals. Evidence of success in this area would be documents that show how learning goals align with activities and assessments and with the department vision.",
      levels: {
        0: "No courses align learning goals, activities, and assessments",
        1: "Few courses align learning goals, activities, and assessments",
        2: "Some courses have well-aligned learning goals, activities, and assessments",
        3: "Many courses have well-aligned learning goals, activities, and assessments",
        4: "Most courses have well-aligned learning goals, activities, and assessments",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000007",
      scaleVersionId: "40000000-0000-0000-0006-000000000007",
      section: "C. INSTITUTIONAL SUPPORT",
      orderIndex: 7,
      prompt: "CRITERION C1: Quality onboarding of new faculty\n\nCONTEXT: This criterion addresses the quality of faculty onboarding and mentoring programs. Faculty onboarding programs can be as short as 1-2 hours in a single session. However, some are much more extensive, with multiple sessions that extend over the entire first year. The best onboarding programs provide for a discussion of issues related to teaching and pedagogy. Departmental or institutional formal mentoring programs are also valuable. The best faculty mentoring programs assign faculty members from different ranks and perspectives to serve as mentors, often specify the frequency of meetings between mentor and mentee and provide guidance for mentors specifically to discuss issues around teaching performance and pedagogy.",
      levels: {
        0: "Faculty receive no formal onboarding. Mentoring of any type is informal if present.",
        1: "Mandatory, single-session onboarding for new faculty/staff to the institution includes little or no orientation to issues related to teaching and pedagogy. If present, mentoring for teaching is informal and rarely includes adjunct instructors.",
        2: "Onboarding exceeds the mandatory single session. Some opportunities for the development of teaching skills are available (optional for adjunct instructors), maybe including formal mentoring.",
        3: "Multiple, formal onboarding sessions around teaching are mandatory for new faculty/staff, including adjuncts, throughout the first year. Designated formal mentor is well-versed in pedagogy",
        4: "Multiple, formal onboarding sessions around teaching are mandatory for new faculty/staff, including adjuncts, throughout the first year. Designated formal mentor is well-versed in pedagogy. On-going institutional and departmental discussions around continuous improvement of the onboarding process occur.",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000008",
      scaleVersionId: "40000000-0000-0000-0006-000000000008",
      section: "C. INSTITUTIONAL SUPPORT",
      orderIndex: 8,
      prompt: "CRITERION C2: Institutional support for faculty training in emergent curricula, technology, and work-place competencies\n\nCONTEXT: This criterion addresses the degree to which a faculty member’s institution supports training in new curricula, technology, and work-place competencies needed in a dynamic world. For students to be well-prepared for careers requiring mathematics and for mathematics-based decision-making to solve real-world problems, faculty need to be aware of these changes. Preparing faculty may take multiple forms including 1) day-long or week-long workshops, 2) attending professional discipline-based meetings, or 3) spending time with an expert in the area.",
      levels: {
        0: "Faculty are discouraged from taking time for training in areas emerging from research that should be incorporated into student learning outcomes",
        1: "Faculty who participate in training in areas emerging from research that should be incorporated into student learning outcomes do so without departmental or institutional financial support",
        2: "Faculty who participate in training in areas emerging from research that should be incorporated into student learning outcomes can request support; support is occasionally available",
        3: "Faculty who participate in training in areas emerging from research that should be incorporated into student learning outcomes can request support; support is frequently available",
        4: "The department/ institution has funds designated for training in areas emerging from research that should be incorporated into student learning outcomes, and faculty are encouraged to use them",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000009",
      scaleVersionId: "40000000-0000-0000-0006-000000000009",
      section: "C. INSTITUTIONAL SUPPORT",
      orderIndex: 9,
      prompt: "CRITERION C3: Support for teaching strategies that enhance student learning\n\nCONTEXT: This criterion pertains to the degree of institutional support for learning how to implement evidence-based teaching practices, including innovative use of classroom spaces to enhance student learning. At many institutions, Teaching and Learning Centers (TLCs) have been established to serve as an organizing hub for these activities. The criterion is written in terms of what a TLC might provide, but it is possible that similar institutional support could be provided in the absence of a Teaching and Learning Center, so the criterion should be interpreted in that light.",
      levels: {
        0: "No formal institutional support, such as a Teaching and Learning Center (TLC)",
        1: "TLC or other formal institutional support available, but programming is limited",
        2: "TLC or other formal institutional support is broad in scope, but does not address specific disciplinary needs for mathematics faculty",
        3: "TLC or similar structure supports math faculty with customized workshops for mathematics teaching and learning",
        4: "TLC or similar structure offers consultations and provides responsive programming that includes workshops that meet the needs of mathematics faculty",
      },
    },
    {
      id: "30000000-0000-0000-0006-000000000010",
      scaleVersionId: "40000000-0000-0000-0006-000000000010",
      section: "C. INSTITUTIONAL SUPPORT",
      orderIndex: 10,
      prompt: "CRITERION C4: Institutional support for academic resources\n\nCONTEXT: This criterion addresses the importance of access to academic resources for enhancing and improving teaching. Issues\n\nto consider include accessibility of electronic resources for faculty and students, and assignment of resource costs to the institution\n\nor the negotiation of reduced costs for departments and/or students. Electronic resources include online journal subscriptions,\n\nlicenses to key software packages, and other emerging academic resources.",
      levels: {
        0: "No institutional support for academic resources",
        1: "Very limited institutional support for academic resources",
        2: "Some institutional support is available for academic resources, but support is not consistent.",
        3: "Institutional support for acquiring academic resources is available but not for all resources needed for teaching mathematics.",
        4: "Institutional support for acquiring requested academic resources is consistently available for all faculty and staff.",
      },
    },
  ],
})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
