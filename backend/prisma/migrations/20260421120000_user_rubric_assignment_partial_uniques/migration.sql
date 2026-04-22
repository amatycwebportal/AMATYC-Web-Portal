-- PostgreSQL treats NULLs as distinct in UNIQUE constraints, so the prior
-- (userId, rubricVersionId, courseBinId) unique index did not prevent duplicate
-- global assignments (courseBinId IS NULL). Replace it with partial unique indexes.

-- Remove duplicate global assignment rows (keep the oldest row per key).
DELETE FROM "UserRubricAssignment" AS a
USING "UserRubricAssignment" AS b
WHERE a."courseBinId" IS NULL
  AND b."courseBinId" IS NULL
  AND a."userId" = b."userId"
  AND a."rubricVersionId" = b."rubricVersionId"
  AND a.id > b.id;

DROP INDEX IF EXISTS "UserRubricAssignment_userId_rubricVersionId_courseBinId_key";

CREATE UNIQUE INDEX "UserRubricAssignment_userId_rubricVersionId_global_key"
  ON "UserRubricAssignment" ("userId", "rubricVersionId")
  WHERE "courseBinId" IS NULL;

CREATE UNIQUE INDEX "UserRubricAssignment_userId_rubricVersionId_courseBinId_scoped_key"
  ON "UserRubricAssignment" ("userId", "rubricVersionId", "courseBinId")
  WHERE "courseBinId" IS NOT NULL;
