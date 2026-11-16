-- AlterTable
ALTER TABLE "Rubric" ADD COLUMN "section_descriptions" JSONB;

-- AlterTable
ALTER TABLE "RubricVersion" ADD COLUMN "section_descriptions" JSONB;
