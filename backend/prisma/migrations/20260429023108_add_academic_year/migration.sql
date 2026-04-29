/*
  Warnings:

  - Added the required column `academic_school_year` to the `Institution` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Response_userId_scaleVersionId_rubricVersionId_courseBinId_key";

-- DropIndex
DROP INDEX "Response_userId_scaleVersionId_rubricVersionId_global_key";

-- DropIndex
DROP INDEX "UserRubricAssignment_userId_rubricVersionId_courseBinId_scoped_";

-- DropIndex
DROP INDEX "UserRubricAssignment_userId_rubricVersionId_global_key";

-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "academic_school_year" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';
