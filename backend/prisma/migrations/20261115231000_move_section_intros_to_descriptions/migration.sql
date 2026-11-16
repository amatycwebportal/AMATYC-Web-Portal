-- Moves section introductions that were seeded at the top of a section's first scale prompt
-- into Rubric.section_descriptions, then publishes a new rubric version (like an editor save)
-- so people already working on the previous version keep the text they started with.
-- Matches on the exact seeded text, so rubrics that were edited by hand are left alone.

CREATE TEMP TABLE "_section_intro_moves" ("section" TEXT NOT NULL, "intro" TEXT NOT NULL);

INSERT INTO "_section_intro_moves" ("section", "intro") VALUES
  ('A. PEDAGOGY', 'AMATYC’s Standards for Pedagogy (Crossroads, 2023) that follow recommend the use of instructional strategies that provide for student activity and student-constructed knowledge. Evidence-based strategies which can be incorporated by most teachers without requiring substantial faculty development are highlighted in these standards. Furthermore, the standards are in agreement with the instructional recommendations contained in Common Vision (2015).'),
  ('A. STANDARDS FOR CONTENT', 'Rather than focusing solely on content knowledge, this document takes the position that to truly know mathematics and statistics one must know it conceptually, contextually, and procedurally and that problem solving is the heart of doing mathematics. The successful problem solver can view the world from a mathematical perspective (Schoenfeld, 1992).

Students develop the ability to solve meaningful problems through in-depth study of mathematics and statistics topics that build on their prior knowledge and experiences. When presented in the context of relevant applications, abstract topics grow naturally out of the need to describe or represent the patterns that emerge. In general, the meaning, use, and communication of mathematical and statistical ideas must be emphasized. Attention to rote memorization and manipulation must decrease.

The content standards that follow are not meant to outline a set of courses. Rather, they are strands to be included in a post-secondary mathematics pathway in whatever structural form they may take. The specific themes were selected so that learners can develop the knowledge and skills needed to be discerning citizens, making data-based decisions, and evaluating mathematical and statistical arguments. Students should also be equipped to pursue more advanced study in mathematics and other disciplines.'),
  ('B. STANDARDS FOR INTELLECTUAL DEVELOPMENT', 'At the conclusion of the first two years of their college studies, all students should have progressed in their development of certain intellectual abilities, habits of mind, and of other competencies and knowledge. Introductory college courses across disciplines should be designed to broaden an existing educational foundation and allow students to appreciate mathematics, statistics, and data science as powerful reasoning, modeling, and general problem solving tools.'),
  ('III. CURRICULUM AND PROGRAM DEVELOPMENT', 'At the conclusion of the first two years of their college studies, all students should have progressed in their development of certain intellectual abilities, habits of mind, and of other competencies and knowledge. Introductory college courses across disciplines should be designed to broaden an existing educational foundation and allow students to appreciate mathematics, statistics, and data science as powerful reasoning, modeling, and general problem solving tools.');

CREATE TEMP TABLE "_section_intro_matches" AS
SELECT s."id" AS "scaleId", s."rubricId", m."section", m."intro"
FROM "Scale" s
JOIN "_section_intro_moves" m
  ON s."section" = m."section"
 AND left(s."prompt", length(m."intro") + 2) = m."intro" || E'\n\n';

UPDATE "Scale" s
SET "prompt" = substr(s."prompt", length(x."intro") + 3)
FROM "_section_intro_matches" x
WHERE s."id" = x."scaleId";

UPDATE "Rubric" r
SET "section_descriptions" = COALESCE(r."section_descriptions", '{}'::jsonb) || d."descriptions"
FROM (
  SELECT "rubricId", jsonb_object_agg("section", "intro") AS "descriptions"
  FROM (SELECT DISTINCT "rubricId", "section", "intro" FROM "_section_intro_matches") distinct_matches
  GROUP BY "rubricId"
) d
WHERE r."id" = d."rubricId";

DO $$
DECLARE
  affected RECORD;
  previous_version_id UUID;
  new_version_id UUID;
BEGIN
  FOR affected IN SELECT DISTINCT "rubricId" FROM "_section_intro_matches" LOOP
    SELECT "id" INTO previous_version_id
    FROM "RubricVersion"
    WHERE "rubricId" = affected."rubricId"
    ORDER BY "versionNum" DESC
    LIMIT 1;

    -- Rubrics without versions get their first version (with descriptions) from the live rows on demand.
    CONTINUE WHEN previous_version_id IS NULL;

    new_version_id := gen_random_uuid();

    INSERT INTO "RubricVersion" ("id", "rubricId", "versionNum", "changelog", "section_descriptions")
    SELECT
      new_version_id,
      affected."rubricId",
      MAX(v."versionNum") + 1,
      'Moved section introductions into section descriptions',
      (SELECT r."section_descriptions" FROM "Rubric" r WHERE r."id" = affected."rubricId")
    FROM "RubricVersion" v
    WHERE v."rubricId" = affected."rubricId";

    INSERT INTO "ScaleVersion" (
      "id", "rubricVersionId", "originalScaleId", "prompt", "orderIndex",
      "isGlobal", "editable", "levelDescriptions", "section"
    )
    SELECT
      gen_random_uuid(), new_version_id, s."id", s."prompt", s."orderIndex",
      s."isGlobal", s."editable", s."levelDescriptions", s."section"
    FROM "Scale" s
    WHERE s."rubricId" = affected."rubricId"
      AND (s."section" IS NULL OR left(s."section", 15) <> '__GRAVEYARD__::');

    UPDATE "UserRubricAssignment"
    SET "rubricVersionId" = new_version_id
    WHERE "rubricVersionId" = previous_version_id
      AND "status" = 'ASSIGNED';
  END LOOP;
END $$;

DROP TABLE "_section_intro_matches";
DROP TABLE "_section_intro_moves";
