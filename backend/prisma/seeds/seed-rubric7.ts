import { prisma } from "@lib/prisma";
import { seedSnapshotRubric } from "./seedSnapshotRubric";

// Source: Word Documents/7 2023 Climate for Transformation.docx
seedSnapshotRubric({
  rubricId: "10000000-0000-0000-0000-000000000070",
  rubricVersionId: "10000000-0000-0000-0007-000000000001",
  title: "Teaching for PROWESS — Rubric 7: Climate for Transformation (10 criteria)",
  description: "Please read the entire Introduction before completing the Rubric\n\nThe Teaching for PROWESS (TfP) Vision & Transformation Catalyst Tool is a diagnostic tool designed to be used in a self-study to evaluate the implementation of the recommendations of the AMATYC Standards (referring to Crossroads in Mathematics, Beyond Crossroads, and IMPACT) in mathematics departments. The work is based on the extensive work of Partnership for Undergraduate Life Science Education (PULSE)* which was focused on Biology in 4-year institutions. They have been modified based on the features expected in a 2-year college math department that has fully implemented all of the AMATYC recommendations. They are meant as tools to highlight the areas where departments stand out and areas where departments have made less progress.\n\nThe complete Teaching for PROWESS Vision & Transformation Catalyst Tool contains 8 rubrics:\n\n1) Student Learning and the Learning Environment, 2) Instruction, 3) Curriculum and Program Development, 4) Assessment of Student Learning, 5) Diversity, Equity, and Inclusion, 6) Professionalism, 7) Climate for Transformation and 8) Snapshot.\n\nTerminology: The rubrics can be used to evaluate individual departments, or a division composed of mathematics faculty (either full-time or part-time) which will be referred to as ‘departments’ in this document. The use of the term ‘faculty’ throughout the rubrics is meant as a generic term for the range of possible titles for all those who are instructors in any course that is part of the department being evaluated.\n\nProcedure: Once a department chooses an area, or areas, they would like to examine, the faculty should then individually determine scores for the rubrics. Each criterion begins with a CONTEXT section that should be read prior to reading the criterion’s descriptors. Once a score for a criterion is determined it is important to document the justification in the appropriate section of the table. After the individual results are completed, the department should determine and report a consensus score for each criterion. For more information and suggestions on completing this process, refer to the Rubric FAQs on the teachingforprowess.wordpress.com website.\n\n* This material is based upon work supported by the National Science Foundation under Grants No. 2012962, 2013232, 2013493, 2013550. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.\n\n** An initiative launched by the National Science Foundation (NSF), the Howard Hughes Medical Institute (HHMI), and the National Institute for General Medical Sciences (NIGMS/NIH).\n\nRubric VII - Climate for Transformation (9 criteria)\n\nThe purpose of this rubric is to assist departments in assessing the institutional, administrative, and departmental openness to and movement toward the type of change outlined for mathematics education in the AMATYC Standards. Although many of these criteria are out of the control of departments and faculty, they are critical for transformation and sustainability of reform efforts in mathematics education. The criteria included in this rubric are broadly applicable to other STEM disciplines.\n\nThere is no doubt that the efforts of charismatic or energetic individuals are critical to catalyzing transformation and/or reform. However, there is a critical role for the Board of Trustees and senior level administration, including the Provost, Chancellor, President, VPs, and in some cases Deans, at a given institution to play in setting a tone or climate that is conducive to change efforts. In addition to allocating basic resources necessary for teaching, senior administration determines to a large extent what efforts are recognized or rewarded. Departments that have a positive climate for change – positive working relationship and/or empowerment by the institution’s administration – are more likely to be successful in the long term in their efforts to reform mathematics education. Therefore, although this rubric can be challenging to complete given the qualitative nature of the items being assessed and the fact that departments often have little control of these criteria, this rubric measures an important component for promoting departmental transformation. Categories include: A) Attitude toward Transformation Initiatives, B) Strategies for Promoting Systemic Transformation, and C) Concrete Implementations Promoting Transformation.",
  criteria: [
    {
      id: "30000000-0000-0000-0007-000000000001",
      scaleVersionId: "40000000-0000-0000-0007-000000000001",
      section: "A. ATTITUDE TOWARD TRANSFORMATION INITIATIVES",
      orderIndex: 1,
      prompt: "CRITERION A1: Administrative support for national transformation initiatives in higher education\n\nCONTEXT: This criterion addresses the degree to which the administration is aware of and acts on national change initiatives (such as those described in or by the American Association of Community Colleges Pathways, Achieving the Dream, Center for Community College Student Engagement, Community College Research Center, California Acceleration Project, Complete College America, National Research Council of National Academies, and Accelerating Systemic Change Network).",
      levels: {
        0: "Administration is not aware of national initiatives or does not acknowledge these initiatives in higher education",
        1: "Administration is aware of and has read about initiatives in higher education, but no action is taken",
        2: "Administration supports enacting national initiatives in higher education, but no long-term plan or funding is in place",
        3: "Administration takes action regularly to enact national initiatives in higher education and a short-term action plan is in place",
        4: "Administration takes action regularly to enact national initiatives in higher education; administration allocates resources and establishes a long-term action plan",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000002",
      scaleVersionId: "40000000-0000-0000-0007-000000000002",
      section: "A. ATTITUDE TOWARD TRANSFORMATION INITIATIVES",
      orderIndex: 2,
      prompt: "CRITERION A2: Administrative support for state and national transformation initiatives in mathematics education\n\nCONTEXT: This criterion addresses the degree to which the administration is aware of, has read about, and acts on national recommendations concerning mathematics education. State initiatives may be created by state-wide task forces, steering committees, forums, or summits. National initiatives may be from national mathematics organizations included in the Conference Board of the Mathematical Sciences or by other groups (Dana Center, Carnegie Foundation for the Advancement of Teaching, PCAST, TPSE Math, Common Vision).",
      levels: {
        0: "Administration is not aware of national initiatives or does not acknowledge these initiatives in mathematics education",
        1: "Administration is aware of and has read about initiatives in mathematics education, but no action is taken",
        2: "Administration supports enacting state and national initiatives in mathematics education, but no long-term plan or funding is in place",
        3: "Administration takes action regularly to enact state and national initiatives in mathematics education and a short-term action plan is in place",
        4: "Administration takes action regularly to enact state and national initiatives in mathematics education; administration allocates resources and establishes a long-term action plan",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000003",
      scaleVersionId: "40000000-0000-0000-0007-000000000003",
      section: "A. ATTITUDE TOWARD TRANSFORMATION INITIATIVES",
      orderIndex: 3,
      prompt: "CRITERION A3: Attitude of department faculty toward national transformation initiatives in higher education\n\nCONTEXT: This criterion addresses the degree to which the department faculty is aware of, have read about, and act on national transformation initiatives (such as those described in or by the American Association of Community Colleges Pathways, Achieving the Dream, Center for Community College Student Engagement, Community College Research Center, California Acceleration Project, Complete College America, National Research Council of National Academies, and Accelerating Systemic Change Network).",
      levels: {
        0: "Faculty are not aware of national initiatives or does not acknowledge these initiatives in higher education",
        1: "Faculty have read about national transformation initiatives in higher education, but do not implement them (i.e. faculty is change averse)",
        2: "Department faculty are aware of and discussing national transformation initiatives in higher education",
        3: "Department faculty are discussing national transformation initiatives in higher education and establishing short-term action plans",
        4: "Department faculty are implementing national transformation initiatives in higher education and establishing long-term action plans",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000004",
      scaleVersionId: "40000000-0000-0000-0007-000000000004",
      section: "A. ATTITUDE TOWARD TRANSFORMATION INITIATIVES",
      orderIndex: 4,
      prompt: "CRITERION A4: Attitude of department faculty toward state and national transformation initiatives in mathematics education\n\nCONTEXT: This criterion addresses the degree to which the faculty are aware of, have read about, and acts on national recommendations concerning mathematics education. State initiatives may be created by state-wide task forces, steering committees, forums, or summits. National initiatives may be from national mathematics organizations included in the Conference Board of the Mathematical Science",
      levels: {
        0: "Faculty are not aware of state and national initiatives or does not acknowledge these initiatives in mathematics education",
        1: "Faculty have read about state and national transformation initiatives in mathematics education, but do not implement them (i.e. faculty is change averse)",
        2: "Department faculty are aware of and discussing state and national transformation initiatives in mathematics education",
        3: "Department faculty are discussing state and national transformation initiatives in mathematics education and establishing short-term action plans",
        4: "Department faculty are implementing state and national transformation initiatives in mathematics education and establishing long-term action plans",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000005",
      scaleVersionId: "40000000-0000-0000-0007-000000000005",
      section: "B. STRATEGIES FOR PROMOTING SYSTEMIC TRANSFORMATION",
      orderIndex: 5,
      prompt: "CRITERION B1: Strategies to recruit qualified diverse teaching faculty\n\nCONTEXT: It has been well established that diverse working groups (for example, diverse with respect to race, ethnicity, experience, and skills) leads to better outcomes. At a community college, these outcomes include the success of students from historically marginalized communities in mathematics. This criterion addresses the degree to which the institution takes specific actions towards hiring a diverse teaching faculty necessary to support and sustain these efforts. Formal actions might include 1) placing job advertisements on sites that are targeted to diverse groups, 2) establishing policies that relieve the department of the travel costs for on campus interviews, 3) providing funding for cluster hires that intentionally recruit a group of diverse STEM faculty, 4) informing potential hires of the policies and culture of the institution that support a diverse faculty, 5) requiring all potential hires to explain how they have, or plan to, support reform efforts in both higher and mathematics education, and in particular 6) requiring all potential hires to explain how they have, or plan to, incorporate equity and inclusion in their teaching of mathematics.",
      levels: {
        0: "No active strategies for recruiting diverse faculty either informally or formally",
        1: "The need to recruit qualified diverse faculty is discussed informally as important, but no formal action is taken",
        2: "Formal actions such as search committee and department chair training in supporting diversity and proactive recruitment of qualified diverse faculty are in place",
        3: "Formal actions such as search committee and department chair training and proactive recruitment are in place; resources (such as funding for cluster hires) are provided to incentivize hiring qualified diverse faculty",
        4: "Formal actions such as search committee and department chair training and proactive recruitment are in place; resources are provided to incentivize hiring qualified diverse faculty. Recruitment, and selection of diverse faculty are tracked, and data used to improve strategies",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000006",
      scaleVersionId: "40000000-0000-0000-0007-000000000006",
      section: "B. STRATEGIES FOR PROMOTING SYSTEMIC TRANSFORMATION",
      orderIndex: 6,
      prompt: "CRITERION B2: Strategies to retain qualified diverse teaching faculty\n\nCONTEXT: This criterion addresses the degree to which the institution takes specific actions towards retaining a diverse teaching faculty that nourish and develop the work of all faculty. Institutional structures in place to promote and support efforts to stay current with national efforts for transformation of higher education, especially in mathematics education that might include: 1) formal mentoring plans for new full-time faculty members, 2) formal mentoring plans for all part-time faculty members, and 3) incentives for faculty participation in the mentoring process,.",
      levels: {
        0: "No active strategies for retaining diverse faculty either informally or formally",
        1: "The need to retain qualified diverse faculty is discussed informally as important, but no formal action is taken",
        2: "Mentoring of full and part-time faculty occurs informally and experience faculty are encouraged to participate as a mentor",
        3: "Formal mentoring plans are in place, including a process that intentionally pairs mentors with mentees based on experiences, courses taught and teaching modalities, and includes structures for facilitating discussions about teaching and learning that nourish and develop the work of both mentor and mentee",
        4: "Formal mentoring plans include appropriately paired mentors and mentees, a set of specific requirements and expectations of the mentoring process is established with the flexibility to adjust according the needs of the faculty, and incentives are in place for participation in the process",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000007",
      scaleVersionId: "40000000-0000-0000-0007-000000000007",
      section: "B. STRATEGIES FOR PROMOTING SYSTEMIC TRANSFORMATION",
      orderIndex: 7,
      prompt: "CRITERION B3: Institutional support for faculty to develop and update courses\n\nCONTEXT: This criterion is focused on the degree to which the institution supports the efforts of faculty to develop and update courses to align with the principles outlined in the AMATYC Standards. The underlying issue here is that it takes time to create a new course or to redesign a current course to make changes such as moving from an instructor-focused lecture course to a student-focused course engaging students in active learning. Many faculty express interest in changing the way they teach but find it difficult or impossible to do it due to pressing commitments. Thus, institutional support that incentivizes faculty, such as providing stipends or release/reassign time for course development or redesign, can be critical. Institutions may also fund course leads who provide templates for redesigned courses.",
      levels: {
        0: "Course development and redesign are not recognized as an important activity",
        1: "Course development and redesign are recognized as important activities, but no incentives or resources are provided",
        2: "Course development and redesign are recognized as important activities; incentives and resources not defined, are minimal, and are granted infrequently",
        3: "Course development and redesign are recognized as important activities with well-defined incentives and resources, but funding is not consistently available",
        4: "Course development and redesign are encouraged and supported. Faculty innovations in teaching are encouraged with substantive incentives and resources provided by policy and/or sustained institutional funding",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000008",
      scaleVersionId: "40000000-0000-0000-0007-000000000008",
      section: "C. CONCRETE IMPLEMENTATIONS PROMOTING TRANSFORMATION",
      orderIndex: 8,
      prompt: "CRITERION C1: Mechanisms for collaborative communication on significant educational challenges\n\nCONTEXT: This criterion addresses the degree to which stakeholders (faculty, staff, administrators, etc.) across the institution effectively communicate about nationally-recognized and institution-specific challenges and issues in mathematics education in the first two years of college. Such discussions might include how to address recommendations from national reports and studies, educational best practices, data on student outcomes, and measures of student success. Institution-specific data and issues might include DFW rates, retention, persistence, success of students from non-traditional and underrepresented backgrounds, and outcomes such as graduation rates, types of employment, rate of entry into additional educational programs, etc. For scores of 3 and 4, formal mechanisms such as committees, professional learning communities, or working groups that actively engage key stakeholders across the institution around these issues exist. An example of an evidence-based working group structure to promote change in higher education departments is the Departmental Action Teams model: https://dat-project.org/. To achieve a score of 4, discussions that identify significant disparities or issues must lead to changes in programs to address those concerns.",
      levels: {
        0: "There is little discussion of educational challenges that impact student success (e.g. retention, persistence, success of underrepresented students)",
        1: "There is informal discussion of educational challenges that impact student success, but discussions include only a limited group of stakeholders with infrequent, irregular meetings",
        2: "Informal discussion of educational challenges that impact student success includes the majority of college stakeholders, but there are no mechanisms for collaborative communication.",
        3: "Formal communication mechanism (committees, professional learning community or working groups) exists for discussion of educational challenges that impact student success. The committee includes the majority of college stakeholders",
        4: "Formal communication mechanism committees, professional learning community or working groups) exists for discussion of educational challenges that impact student success. The committee includes the majority of college stakeholders, who collaborate actively to make impactful changes",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000009",
      scaleVersionId: "40000000-0000-0000-0007-000000000009",
      section: "C. CONCRETE IMPLEMENTATIONS PROMOTING TRANSFORMATION",
      orderIndex: 9,
      prompt: "CRITERION C2: Institutional assessment of student engagement and learning\n\nCONTEXT: This criterion reflects the culture of an institution in understanding the learning experience of their students and using that information to inform improvements in their general education and disciplinary programs. Institutions with a strong, positive culture of assessment and evaluation often foster and support those processes at a program level. Best practices in institutional assessment would include sharing of data with a broad spectrum of stakeholders across the institution and use for improvement in institutional structures, the general education experience, and in the curricula required for specific programs.\n\nIndirect measures usually ask students to complete surveys or respond in focus groups regarding their perception of their learning, engagement, and/or their satisfaction with their experience at the institution. Surveys of student engagement may include the Survey of Entering Student Engagement (SENSE), Community College Survey of Student Engagement (CCSSE),and Community College Faculty Survey of Student Engagement (CCFSSE). Direct measures are aimed at directly evaluating student skills or knowledge, measured either with artifacts produced within courses or through end of course or end of program assessments.",
      levels: {
        0: "Minimal compliance with what is required for institutional accreditation, but no genuine effort to engage institutional stakeholders in meaningful evaluation of engagement and learning",
        1: "Most data are derived from indirect satisfaction surveys, and efforts to collect direct evidence on engagement and learning are limited, fragmented or uncoordinated",
        2: "Some data from both indirect and direct sources are collected, but dissemination of results is limited; these data are used generically for improvement of the student experience",
        3: "Direct and indirect data are collected with emphasis on direct measures; results are broadly disseminated, and data are used generically for improvement of the student experience",
        4: "Student engagement and learning is assessed using of mixture of direct and indirect instruments; results are broadly disseminated, and data are used to improve specific outcomes such as persistence and career path success",
      },
    },
    {
      id: "30000000-0000-0000-0007-000000000010",
      scaleVersionId: "40000000-0000-0000-0007-000000000010",
      section: "C. CONCRETE IMPLEMENTATIONS PROMOTING TRANSFORMATION",
      orderIndex: 10,
      prompt: "CRITERION C3: Formal evaluation of faculty with a focus on teaching and learning\n\nCONTEXT: The purpose of formal evaluation of faculty should be to assist faculty to use the latest research to improve teaching and learning. Formal evaluation includes regular/annual review as well as review for promotion/tenure of faculty.\n\nThese formal evaluations should include scholarly teaching using the following criteria: student evaluations, peer and/or administrator evaluations, and self-assessment/reflection. Scholarly teaching is the practice of evaluating whether students achieve learning goals and reflecting on teaching practices to continuously improve student learning. Student course evaluations vary from institution to institution. At a minimum, course evaluations ask for student perceptions about the quality of the class and the quality of the faculty. At the high end, course evaluations might ask about the teaching approaches utilized and student perception of learning gains. Peer or administrator evaluations are when others assess teaching effectiveness and can include information about the strategies utilized and the level of student engagement. The self-assessment/reflection should include utilizing the student and peer evaluations, as well indirect measures, to improve their teaching and student learning. Examples of indirect measures include the Survey of Students’ Experiences (SEAL) or a colleague’s use of the Observation Protocol of Active Learning (OPAL) to establish goals and to create a course of action for improvement.",
      levels: {
        0: "There is no connection between evaluation of faculty and improvement of learning",
        1: "Evaluation of faculty is based on only one or the criteria and has minimal impact for improvement of learning.",
        2: "Evaluation of faculty is based on two of the criteria and some attempt is made to use the data to improve teaching and learning.",
        3: "Evaluation of faculty is based on all three of the criteria and instructors are expected to use the data to improve teaching and learning.",
        4: "Evaluation of faculty is based on all three criteria and a formal structure is in place that helps instructors use data from the different criteria to improve teaching and learning.",
      },
    },
  ],
})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
