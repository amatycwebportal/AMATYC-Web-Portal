-- Restore partial unique indexes dropped in 20260429023108_add_academic_year.
-- PostgreSQL treats NULLs as distinct in plain UNIQUE constraints, so partial indexes
-- are required to prevent duplicate general (courseBinId IS NULL) assignments.

DELETE FROM "UserRubricAssignment" AS a
USING "UserRubricAssignment" AS b
WHERE a."courseBinId" IS NULL
  AND b."courseBinId" IS NULL
  AND a."userId" = b."userId"
  AND a."rubricVersionId" = b."rubricVersionId"
  AND a.id > b.id;

DELETE FROM "UserRubricAssignment" AS a
USING "UserRubricAssignment" AS b
WHERE a."courseBinId" IS NOT NULL
  AND b."courseBinId" IS NOT NULL
  AND a."userId" = b."userId"
  AND a."rubricVersionId" = b."rubricVersionId"
  AND a."courseBinId" = b."courseBinId"
  AND a.id > b.id;

CREATE UNIQUE INDEX IF NOT EXISTS "UserRubricAssignment_userId_rubricVersionId_global_key"
  ON "UserRubricAssignment" ("userId", "rubricVersionId")
  WHERE "courseBinId" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "UserRubricAssignment_userId_rubricVersionId_courseBinId_scoped_key"
  ON "UserRubricAssignment" ("userId", "rubricVersionId", "courseBinId")
  WHERE "courseBinId" IS NOT NULL;
