-- Replace institution course bins with a fixed pathway catalog applied on rubrics.

CREATE TABLE "Pathway" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    CONSTRAINT "Pathway_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Pathway_name_key" ON "Pathway"("name");

INSERT INTO "Pathway" ("id", "name", "sort_order") VALUES
    ('30000000-0000-0000-0000-000000000001', 'General', 0),
    ('30000000-0000-0000-0000-000000000002', 'Statistics', 1),
    ('30000000-0000-0000-0000-000000000003', 'Quantitative Reasoning', 2),
    ('30000000-0000-0000-0000-000000000004', 'STEM', 3),
    ('30000000-0000-0000-0000-000000000005', 'Teacher Preparation', 4);

CREATE TABLE "RubricPathway" (
    "rubricId" UUID NOT NULL,
    "pathwayId" UUID NOT NULL,
    CONSTRAINT "RubricPathway_pkey" PRIMARY KEY ("rubricId","pathwayId")
);

CREATE INDEX "RubricPathway_pathwayId_idx" ON "RubricPathway"("pathwayId");

INSERT INTO "RubricPathway" ("rubricId", "pathwayId")
SELECT "id", '30000000-0000-0000-0000-000000000001'
FROM "Rubric";

INSERT INTO "RubricPathway" ("rubricId", "pathwayId")
SELECT DISTINCT s."rubricId",
    CASE p."binName"
        WHEN 'Intro Statistics' THEN '30000000-0000-0000-0000-000000000002'::uuid
        WHEN 'Quantitative Reasoning' THEN '30000000-0000-0000-0000-000000000003'::uuid
        WHEN 'College Algebra' THEN '30000000-0000-0000-0000-000000000004'::uuid
        WHEN 'Precalculus' THEN '30000000-0000-0000-0000-000000000004'::uuid
        WHEN 'Calculus 1' THEN '30000000-0000-0000-0000-000000000004'::uuid
        WHEN 'Calculus 2' THEN '30000000-0000-0000-0000-000000000004'::uuid
        ELSE '30000000-0000-0000-0000-000000000001'::uuid
    END
FROM "ScaleBin" sb
JOIN "Scale" s ON s."id" = sb."scaleId"
JOIN "PredefinedCourseBin" p ON p."id" = sb."predefinedBinId"
ON CONFLICT DO NOTHING;

ALTER TABLE "UserRubricAssignment" ADD COLUMN "pathwayId" UUID;
ALTER TABLE "Response" ADD COLUMN "pathwayId" UUID;
ALTER TABLE "ConsensusResponse" ADD COLUMN "pathwayId" UUID;

UPDATE "UserRubricAssignment" AS assignment
SET "pathwayId" = CASE predefined."binName"
    WHEN 'Intro Statistics' THEN '30000000-0000-0000-0000-000000000002'::uuid
    WHEN 'Quantitative Reasoning' THEN '30000000-0000-0000-0000-000000000003'::uuid
    WHEN 'College Algebra' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Precalculus' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 1' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 2' THEN '30000000-0000-0000-0000-000000000004'::uuid
    ELSE '30000000-0000-0000-0000-000000000001'::uuid
END
FROM "CourseBin" AS course_bin
JOIN "PredefinedCourseBin" AS predefined ON predefined."id" = course_bin."predefinedBinId"
WHERE assignment."courseBinId" = course_bin."id";

UPDATE "UserRubricAssignment"
SET "pathwayId" = '30000000-0000-0000-0000-000000000001'
WHERE "pathwayId" IS NULL;

UPDATE "ConsensusResponse" AS consensus
SET "pathwayId" = CASE predefined."binName"
    WHEN 'Intro Statistics' THEN '30000000-0000-0000-0000-000000000002'::uuid
    WHEN 'Quantitative Reasoning' THEN '30000000-0000-0000-0000-000000000003'::uuid
    WHEN 'College Algebra' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Precalculus' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 1' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 2' THEN '30000000-0000-0000-0000-000000000004'::uuid
    ELSE '30000000-0000-0000-0000-000000000001'::uuid
END
FROM "CourseBin" AS course_bin
JOIN "PredefinedCourseBin" AS predefined ON predefined."id" = course_bin."predefinedBinId"
WHERE consensus."courseBinId" = course_bin."id";

UPDATE "ConsensusResponse"
SET "pathwayId" = '30000000-0000-0000-0000-000000000001'
WHERE "pathwayId" IS NULL;

UPDATE "Response" AS response
SET "pathwayId" = CASE predefined."binName"
    WHEN 'Intro Statistics' THEN '30000000-0000-0000-0000-000000000002'::uuid
    WHEN 'Quantitative Reasoning' THEN '30000000-0000-0000-0000-000000000003'::uuid
    WHEN 'College Algebra' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Precalculus' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 1' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 2' THEN '30000000-0000-0000-0000-000000000004'::uuid
    ELSE '30000000-0000-0000-0000-000000000001'::uuid
END
FROM "CourseBin" AS course_bin
JOIN "PredefinedCourseBin" AS predefined ON predefined."id" = course_bin."predefinedBinId"
WHERE response."courseBinId" = course_bin."id";

UPDATE "Response" AS response
SET "pathwayId" = CASE predefined."binName"
    WHEN 'Intro Statistics' THEN '30000000-0000-0000-0000-000000000002'::uuid
    WHEN 'Quantitative Reasoning' THEN '30000000-0000-0000-0000-000000000003'::uuid
    WHEN 'College Algebra' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Precalculus' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 1' THEN '30000000-0000-0000-0000-000000000004'::uuid
    WHEN 'Calculus 2' THEN '30000000-0000-0000-0000-000000000004'::uuid
    ELSE '30000000-0000-0000-0000-000000000001'::uuid
END
FROM "PredefinedCourseBin" AS predefined
WHERE response."pathwayId" IS NULL
  AND response."predefinedBinId" = predefined."id";

UPDATE "Response"
SET "pathwayId" = '30000000-0000-0000-0000-000000000001'
WHERE "pathwayId" IS NULL;

-- Collapse rows that mapped onto the same pathway. Prefer completed work.
DELETE FROM "UserRubricAssignment" AS older
USING "UserRubricAssignment" AS newer
WHERE older."userId" = newer."userId"
  AND older."rubricVersionId" = newer."rubricVersionId"
  AND older."pathwayId" = newer."pathwayId"
  AND older."id" <> newer."id"
  AND (
    (CASE older."status" WHEN 'COMPLETED' THEN 3 WHEN 'IN_PROGRESS' THEN 2 ELSE 1 END)
      < (CASE newer."status" WHEN 'COMPLETED' THEN 3 WHEN 'IN_PROGRESS' THEN 2 ELSE 1 END)
    OR (
      older."status" = newer."status"
      AND older."id" > newer."id"
    )
  );

DELETE FROM "ConsensusResponse" AS older
USING "ConsensusResponse" AS newer
WHERE older."userId" = newer."userId"
  AND older."rubricVersionId" = newer."rubricVersionId"
  AND older."pathwayId" = newer."pathwayId"
  AND older."id" <> newer."id"
  AND (
    (CASE older."status" WHEN 'SUBMITTED' THEN 2 ELSE 1 END)
      < (CASE newer."status" WHEN 'SUBMITTED' THEN 2 ELSE 1 END)
    OR (
      older."status" = newer."status"
      AND older."updatedAt" < newer."updatedAt"
    )
    OR (
      older."status" = newer."status"
      AND older."updatedAt" = newer."updatedAt"
      AND older."id" > newer."id"
    )
  );

DELETE FROM "Response" AS older
USING "Response" AS newer
WHERE older."userId" = newer."userId"
  AND older."scaleVersionId" = newer."scaleVersionId"
  AND older."rubricVersionId" = newer."rubricVersionId"
  AND older."pathwayId" = newer."pathwayId"
  AND older."id" <> newer."id"
  AND (
    (CASE older."status" WHEN 'SUBMITTED' THEN 2 ELSE 1 END)
      < (CASE newer."status" WHEN 'SUBMITTED' THEN 2 ELSE 1 END)
    OR (
      older."status" = newer."status"
      AND older."submitted_at" < newer."submitted_at"
    )
    OR (
      older."status" = newer."status"
      AND older."submitted_at" = newer."submitted_at"
      AND older."id" > newer."id"
    )
  );

ALTER TABLE "UserRubricAssignment" ALTER COLUMN "pathwayId" SET NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "pathwayId" SET NOT NULL;
ALTER TABLE "ConsensusResponse" ALTER COLUMN "pathwayId" SET NOT NULL;

DROP INDEX IF EXISTS "UserRubricAssignment_userId_rubricVersionId_global_key";
DROP INDEX IF EXISTS "UserRubricAssignment_userId_rubricVersionId_courseBinId_scoped_key";
DROP INDEX IF EXISTS "UserRubricAssignment_userId_rubricVersionId_courseBinId_key";
DROP INDEX IF EXISTS "UserRubricAssignment_courseBinId_idx";
DROP INDEX IF EXISTS "ConsensusResponse_userId_rubricVersionId_courseBinId_key";
DROP INDEX IF EXISTS "ConsensusResponse_courseBinId_idx";
DROP INDEX IF EXISTS "Response_userId_scaleVersionId_rubricVersionId_courseBinId_key";
DROP INDEX IF EXISTS "Response_userId_scaleVersionId_rubricVersionId_global_key";
DROP INDEX IF EXISTS "Response_courseBinId_idx";
DROP INDEX IF EXISTS "Response_predefinedBinId_idx";

ALTER TABLE "UserRubricAssignment" DROP CONSTRAINT IF EXISTS "UserRubricAssignment_courseBinId_fkey";
ALTER TABLE "ConsensusResponse" DROP CONSTRAINT IF EXISTS "ConsensusResponse_courseBinId_fkey";
ALTER TABLE "Response" DROP CONSTRAINT IF EXISTS "Response_courseBinId_fkey";
ALTER TABLE "Response" DROP CONSTRAINT IF EXISTS "Response_predefinedBinId_fkey";

ALTER TABLE "UserRubricAssignment" DROP COLUMN "courseBinId";
ALTER TABLE "ConsensusResponse" DROP COLUMN "courseBinId";
ALTER TABLE "Response" DROP COLUMN "courseBinId";
ALTER TABLE "Response" DROP COLUMN "predefinedBinId";

CREATE UNIQUE INDEX "UserRubricAssignment_userId_rubricVersionId_pathwayId_key"
    ON "UserRubricAssignment"("userId", "rubricVersionId", "pathwayId");
CREATE INDEX "UserRubricAssignment_pathwayId_idx" ON "UserRubricAssignment"("pathwayId");

CREATE UNIQUE INDEX "ConsensusResponse_userId_rubricVersionId_pathwayId_key"
    ON "ConsensusResponse"("userId", "rubricVersionId", "pathwayId");
CREATE INDEX "ConsensusResponse_pathwayId_idx" ON "ConsensusResponse"("pathwayId");

CREATE UNIQUE INDEX "Response_userId_scaleVersionId_rubricVersionId_pathwayId_key"
    ON "Response"("userId", "scaleVersionId", "rubricVersionId", "pathwayId");
CREATE INDEX "Response_pathwayId_idx" ON "Response"("pathwayId");

ALTER TABLE "RubricPathway"
    ADD CONSTRAINT "RubricPathway_rubricId_fkey"
    FOREIGN KEY ("rubricId") REFERENCES "Rubric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RubricPathway"
    ADD CONSTRAINT "RubricPathway_pathwayId_fkey"
    FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserRubricAssignment"
    ADD CONSTRAINT "UserRubricAssignment_pathwayId_fkey"
    FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Response"
    ADD CONSTRAINT "Response_pathwayId_fkey"
    FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ConsensusResponse"
    ADD CONSTRAINT "ConsensusResponse_pathwayId_fkey"
    FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TABLE IF EXISTS "_InvitationCourseBins";
DROP TABLE IF EXISTS "Course";
DROP TABLE IF EXISTS "UserCourseBin";
DROP TABLE IF EXISTS "ScaleVersionBin";
DROP TABLE IF EXISTS "ScaleBin";
DROP TABLE IF EXISTS "CourseBin";
DROP TABLE IF EXISTS "PredefinedCourseBin";
