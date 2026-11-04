/*
  Warnings:

  - You are about to drop the `_UserAssignedRubrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserCompletedRubrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserInProgressRubrics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rubricVersionId` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scaleVersionId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_scaleId_fkey";

-- DropForeignKey
ALTER TABLE "_UserAssignedRubrics" DROP CONSTRAINT "_UserAssignedRubrics_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserAssignedRubrics" DROP CONSTRAINT "_UserAssignedRubrics_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserCompletedRubrics" DROP CONSTRAINT "_UserCompletedRubrics_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCompletedRubrics" DROP CONSTRAINT "_UserCompletedRubrics_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserInProgressRubrics" DROP CONSTRAINT "_UserInProgressRubrics_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserInProgressRubrics" DROP CONSTRAINT "_UserInProgressRubrics_B_fkey";

-- DropIndex
DROP INDEX "Response_scaleId_idx";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "rubricVersionId" UUID NOT NULL,
ADD COLUMN     "scaleVersionId" UUID NOT NULL,
ALTER COLUMN "scaleId" DROP NOT NULL;

-- DropTable
DROP TABLE "_UserAssignedRubrics";

-- DropTable
DROP TABLE "_UserCompletedRubrics";

-- DropTable
DROP TABLE "_UserInProgressRubrics";

-- CreateTable
CREATE TABLE "RubricVersion" (
    "id" UUID NOT NULL,
    "rubricId" UUID NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "changelog" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RubricVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScaleVersion" (
    "id" UUID NOT NULL,
    "rubricVersionId" UUID NOT NULL,
    "originalScaleId" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isGlobal" BOOLEAN NOT NULL,
    "editable" BOOLEAN NOT NULL,
    "levelDescriptions" JSONB,
    "section" TEXT,

    CONSTRAINT "ScaleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScaleVersionBin" (
    "scaleVersionId" UUID NOT NULL,
    "predefinedBinId" UUID NOT NULL,

    CONSTRAINT "ScaleVersionBin_pkey" PRIMARY KEY ("scaleVersionId","predefinedBinId")
);

-- CreateTable
CREATE TABLE "UserRubricAssignment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rubricVersionId" UUID NOT NULL,
    "status" "AssignmentStatus" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserRubricAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RubricVersion_rubricId_idx" ON "RubricVersion"("rubricId");

-- CreateIndex
CREATE UNIQUE INDEX "RubricVersion_rubricId_versionNum_key" ON "RubricVersion"("rubricId", "versionNum");

-- CreateIndex
CREATE INDEX "ScaleVersion_rubricVersionId_idx" ON "ScaleVersion"("rubricVersionId");

-- CreateIndex
CREATE INDEX "ScaleVersion_originalScaleId_idx" ON "ScaleVersion"("originalScaleId");

-- CreateIndex
CREATE INDEX "ScaleVersionBin_predefinedBinId_idx" ON "ScaleVersionBin"("predefinedBinId");

-- CreateIndex
CREATE INDEX "UserRubricAssignment_rubricVersionId_idx" ON "UserRubricAssignment"("rubricVersionId");

-- CreateIndex
CREATE INDEX "UserRubricAssignment_userId_idx" ON "UserRubricAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRubricAssignment_userId_rubricVersionId_key" ON "UserRubricAssignment"("userId", "rubricVersionId");

-- CreateIndex
CREATE INDEX "Response_scaleVersionId_idx" ON "Response"("scaleVersionId");

-- CreateIndex
CREATE INDEX "Response_rubricVersionId_idx" ON "Response"("rubricVersionId");

-- AddForeignKey
ALTER TABLE "RubricVersion" ADD CONSTRAINT "RubricVersion_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "Rubric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleVersion" ADD CONSTRAINT "ScaleVersion_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "RubricVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleVersionBin" ADD CONSTRAINT "ScaleVersionBin_scaleVersionId_fkey" FOREIGN KEY ("scaleVersionId") REFERENCES "ScaleVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleVersionBin" ADD CONSTRAINT "ScaleVersionBin_predefinedBinId_fkey" FOREIGN KEY ("predefinedBinId") REFERENCES "PredefinedCourseBin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRubricAssignment" ADD CONSTRAINT "UserRubricAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRubricAssignment" ADD CONSTRAINT "UserRubricAssignment_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "RubricVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_scaleVersionId_fkey" FOREIGN KEY ("scaleVersionId") REFERENCES "ScaleVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "RubricVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "Scale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
