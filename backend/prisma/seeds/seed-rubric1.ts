import { prisma } from "@lib/prisma";
import { seedSnapshotRubric } from "./seedSnapshotRubric";

// Source: Word Documents/1 2023 Student Learning and the Learning Environment.docx
seedSnapshotRubric({
  rubricId: "10000000-0000-0000-0000-000000000010",
  rubricVersionId: "10000000-0000-0000-0001-000000000001",
  title: "Teaching for PROWESS — Rubric 1: Student Learning and the Learning Environment (8 criteria)",
  description: "Please read the entire Introduction before completing the Rubric\n\nThe Teaching for PROWESS (TfP) Vision & Transformation Catalyst Tool* is a diagnostic tool designed to be used in a self-study to evaluate the implementation of the recommendations of the AMATYC Standards (referring to Crossroads in Mathematics, Beyond Crossroads, and IMPACT in mathematics departments. The work is based on the extensive work of Partnership for Undergraduate Life Science Education (PULSE)** which was focused on Biology in 4-year institutions. They have been modified based on the features expected in a 2-year college math department that has fully implemented all of the AMATYC recommendations. They are meant as tools to highlight the areas where departments stand out and areas where departments have made less progress.\n\nThe complete Teaching for PROWESS Vision & Transformation Catalyst Tool contains 8 rubrics:\n\n1) Student Learning and the Learning Environment, 2) Instruction, 3) Curriculum and Program Development, 4) Assessment of Student Learning, 5) Diversity, Equity, and Inclusion, 6) Professionalism, 7) Climate for Transformation and 8) Snapshot.\n\nTerminology: The rubrics can be used to evaluate individual departments, or a division composed of mathematics faculty (either full-time or part-time) which will be referred to as ‘departments’ in this document. The use of the term ‘faculty’ throughout the rubrics is meant as a generic term for the range of possible titles for all those who are instructors in any course that is part of the department being evaluated.\n\nProcedure: Once a department chooses an area, or areas, they would like to examine, the faculty should then individually determine scores for the rubrics. Each criterion begins with a CONTEXT section that should be read prior to reading the criterion’s descriptors. Once a score for a criterion is determined it is important to document the justification in the appropriate section of the table. After the individual results are completed, the department should determine and report a consensus score for each criterion. For more information and suggestions on completing this process, refer to the Rubric FAQs on the teachingforprowess.wordpress.com website.\n\n* This material is based upon work supported by the National Science Foundation under Grants No. 2012962, 2013232, 2013493, 2013550. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.\n\n** An initiative launched by the National Science Foundation (NSF), the Howard Hughes Medical Institute (HHMI), and the National Institute for General Medical Sciences (NIGMS/NIH).\n\nRubric I - Student Learning and the Learning Environment (8 criteria)\n\nThis rubric assesses the extent to which mathematics faculty and their institutions create an environment that has the potential to optimize mathematics learning for all students. Two-year colleges serve a student body with varied characteristics and academic needs. Each student is entitled to the best educational experiences and opportunities available. Creating a learning environment that maximizes student learning in mathematics and responds to the needs of all students requires the active involvement of every faculty member and each component of the institution. The latest educational research should be used in designing the learning environment. Categories include: A) Learning Environment and B) Resources and Support.",
  criteria: [
    {
      id: "30000000-0000-0000-0001-000000000001",
      scaleVersionId: "40000000-0000-0000-0001-000000000001",
      section: "A. LEARNING ENVIRONMENT",
      orderIndex: 1,
      prompt: "CRITERION A1: Classroom accommodations (physical space)\n\nCONTEXT: This criterion is focused on providing access to learning opportunities in the classroom for students with physical, learning, and mental disabilities. When estimating the percentage of accessible classrooms, for the denominator, use the classrooms that are generally assigned to your department for teaching; for the numerator, use the subset that are accessible to students with diverse needs. Also, estimate the extent to which accommodations allow students with disabilities to engage in all learning activities.",
      levels: {
        0: "None of the classrooms serve students with diverse needs",
        1: "Less than 10% of assigned classrooms comply with standards to serve students with diverse needs",
        2: "10-50% of assigned classrooms comply with standards to serve students with diverse needs",
        3: "51-75% of assigned classrooms comply with standards to serve students with diverse needs",
        4: "More than 75% of assigned classrooms comply with standards to serve students with diverse needs",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000002",
      scaleVersionId: "40000000-0000-0000-0001-000000000002",
      section: "A. LEARNING ENVIRONMENT",
      orderIndex: 2,
      prompt: "CRITERION A2: Classrooms support active learning\n\nCONTEXT: This criterion is related to the quality and effectiveness of the actual classrooms. The classroom should be large enough that every small group can work on vertical non-permanent surfaces (VNPS) such as whiteboards. Also, the classrooms should be flexible and reconfigurable with furniture that can be easily (and quickly) rearranged to accommodate student groups of different sizes. When scoring this criterion, estimate the percentage of classrooms that support active learning, by using the number of classrooms generally assigned to the department as the denominator and using the subset of classrooms that support active learning as the numerator.",
      levels: {
        0: "All assigned classrooms are lecture style with fixed seating",
        1: "Less than 10% of assigned classrooms are flexible and reconfigurable to encourage student interaction on VNPS",
        2: "10-50% of assigned classrooms are flexible and reconfigurable to encourage student interaction on VNPS",
        3: "51-75% of classrooms are flexible and reconfigurable to encourage student interaction on VNPS; different types of classrooms are available for diverse teaching styles",
        4: "More than 75% of classrooms are flexible and reconfigurable to encourage student interaction on VNPS; different types of classrooms are available for diverse teaching styles",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000003",
      scaleVersionId: "40000000-0000-0000-0001-000000000003",
      section: "A. LEARNING ENVIRONMENT",
      orderIndex: 3,
      prompt: "CRITERION A3: IT infrastructure available and accessible for implementing active-learning practices in the physical classroom space\n\nCONTEXT: This criterion pertains to technological infrastructure rather than physical infrastructure. At many institutions, classroom technology is not controlled at the departmental level, but are instead controlled centrally. Likewise, the department often cannot control the classrooms in which they teach.",
      levels: {
        0: "None of the assigned classrooms have IT technology",
        1: "Few assigned classrooms have one IT resource for active learning purposes",
        2: "Many assigned classrooms have one IT resource for active learning purposes",
        3: "Many assigned classrooms have multiple IT resources for active learning purposes",
        4: "Most assigned classrooms have multiple IT resources for active learning purposes",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000004",
      scaleVersionId: "40000000-0000-0000-0001-000000000004",
      section: "A. LEARNING ENVIRONMENT",
      orderIndex: 4,
      prompt: "CRITERION A4: Informal gathering spaces (in person and virtual) that encourage collaboration\n\nCONTEXT: This criterion speaks to the importance of gathering spaces in creating learning communities between students and with faculty. Informal in person gathering spaces may include lounges, eating areas with seating, libraries, open-access computer labs, or study rooms with technology for virtual collaboration. Informal virtual spaces should include accessible tools that enable students to easily collaborate virtually including synchronous and asynchronous virtual workspaces that allow for mathematical content and thinking to be shared.",
      levels: {
        0: "Informal gathering spaces (in person and virtual) are not available",
        1: "Limited gathering space (in person and virtual) is available, but is under-utilized by students",
        2: "Several gathering spaces (in person and virtual) are available, but student usage is limited",
        3: "Several good gathering spaces (in person and virtual) are available; but only students use the spaces",
        4: "Several good gathering spaces (in person and virtual) are available; and well-utilized by students and faculty",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000005",
      scaleVersionId: "40000000-0000-0000-0001-000000000005",
      section: "A. LEARNING ENVIRONMENT",
      orderIndex: 5,
      prompt: "CRITERION A5: Learning center facilities and resources (in person and virtual) accessible for students\n\nCONTEXT: This criterion is focused on the importance of formal support for student learning and success outside the classroom. Examples of spaces include mathematics, and reading and writing centers and resources. The key point here is having learning resources that are accessible and welcoming to students. Issues to consider may include 1) Is the facility or resource staffed/monitored? If so, is it staffed by trained educators?; 2) Are tutors available (in person and virtual) when needed?; 3) Do the learning centers have the necessary resources such as computers and software used in classrooms or for homework?; 4) Is the reading and writing center open and welcoming to mathematics students?",
      levels: {
        0: "Learning center facilities and resources (in person and virtual) such as mathematics, and reading and writing centers are not available",
        1: "Limited learning center facilities and resources (in person and virtual) such as mathematics, and reading and writing centers are accessible to a few students",
        2: "Several learning center facilities and resources (in person and virtual) such as mathematics, and reading and writing centers are accessible to some students",
        3: "Many learning center facilities and resources (in person and virtual) for mathematics, reading and writing, as well as meeting rooms, study space, and technology are accessible, but do not yet meet all student needs",
        4: "Many learning center facilities and resources (in person and virtual) for mathematics, reading and writing, as well as meeting rooms, study space, and technology are accessible and sufficient to meet all student needs",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000006",
      scaleVersionId: "40000000-0000-0000-0001-000000000006",
      section: "B. RESOURCES AND SUPPORT",
      orderIndex: 6,
      prompt: "CRITERION B1: IT support for teaching in all learning modalities\n\nCONTEXT: This criterion addresses the degree to which the institution provides IT support for innovative teaching. Many student-centered classroom activities rely on technology, such as computers and computer projectors, web access, video/audio capture, etc. Questions to consider may include: Is there support at your institution to ensure that these technologies function and are reliable? If one of these technologies fails, is there immediate IT support? Does the IT staff provide adequate training to instructors in the use of the technology? Does IT ask instructors for recommendations for improving IT support, software to purchase, upgrades needed, etc.? At the highest level of achievement, is the IT staff proactive in presenting emerging technologies to the faculty that can be used to enhance pedagogy including the support for online teaching?",
      levels: {
        0: "No IT support",
        1: "IT staff provide limited support",
        2: "IT staff provide support adequate to meet faculty needs when issues or problems arise",
        3: "IT staff provide support adequate to meet faculty needs when issues or problems arise; in addition, IT staff provide hands-on training",
        4: "IT staff respond quickly to IT crisis; support includes hands-on technology training for faculty and proactive survey of new technology; IT staff proactively suggest innovative technologies",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000007",
      scaleVersionId: "40000000-0000-0000-0001-000000000007",
      section: "B. RESOURCES AND SUPPORT",
      orderIndex: 7,
      prompt: "CRITERION B2: Support staff for student learning\n\nCONTEXT: This criterion is focused on the importance of adequate teaching and teacher support. How well does your institution support the teaching mission with support staff? Examples may include 1) administrative/office staff support, 2) a curriculum development or learning specialist who works with faculty members, 3) a faculty member in your department who engages in discipline based educational research (DBER) and 4) support for training of peer tutors when requested by instructors.",
      levels: {
        0: "No support staff for student learning",
        1: "Limited staff support for student learning",
        2: "Adequate support staff for student learning",
        3: "Sufficient support staff for student learning with a variety of expertise",
        4: "Substantial support staff for student learning with a large variety of expertise",
      },
    },
    {
      id: "30000000-0000-0000-0001-000000000008",
      scaleVersionId: "40000000-0000-0000-0001-000000000008",
      section: "B. RESOURCES AND SUPPORT",
      orderIndex: 8,
      prompt: "CRITERION B3: Institutional support of academic resources for students\n\nCONTEXT: This criterion addresses the importance of affordable access to resources for enhancing and improving student learning. Issues to consider include accessibility to academic resources for students such as technological equipment, licenses to key software packages, Open Educational Resources (OER) and online journal subscriptions.",
      levels: {
        0: "No institutional support of academic resources for students",
        1: "Limited institutional support of academic resources for students",
        2: "Adequate institutional support of some academic resources for students",
        3: "Sufficient institutional support for a variety of academic resources for students",
        4: "Substantial institutional support for a variety of academic resources for students",
      },
    },
  ],
})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
