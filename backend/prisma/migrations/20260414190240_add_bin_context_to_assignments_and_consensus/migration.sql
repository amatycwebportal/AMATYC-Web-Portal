/*
  Warnings:

  - A unique constraint covering the columns `[userId,rubricVersionId,courseBinId]` on the table `ConsensusResponse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,rubricVersionId,courseBinId]` on the table `UserRubricAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ConsensusResponse_userId_rubricVersionId_key";

-- DropIndex
DROP INDEX "UserRubricAssignment_userId_rubricVersionId_key";

-- AlterTable
ALTER TABLE "ConsensusResponse" ADD COLUMN     "courseBinId" UUID;

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "UserRubricAssignment" ADD COLUMN     "courseBinId" UUID;

-- CreateIndex
CREATE INDEX "ConsensusResponse_courseBinId_idx" ON "ConsensusResponse"("courseBinId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsensusResponse_userId_rubricVersionId_courseBinId_key" ON "ConsensusResponse"("userId", "rubricVersionId", "courseBinId");

-- CreateIndex
CREATE INDEX "UserRubricAssignment_courseBinId_idx" ON "UserRubricAssignment"("courseBinId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRubricAssignment_userId_rubricVersionId_courseBinId_key" ON "UserRubricAssignment"("userId", "rubricVersionId", "courseBinId");

-- AddForeignKey
ALTER TABLE "UserRubricAssignment" ADD CONSTRAINT "UserRubricAssignment_courseBinId_fkey" FOREIGN KEY ("courseBinId") REFERENCES "CourseBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsensusResponse" ADD CONSTRAINT "ConsensusResponse_courseBinId_fkey" FOREIGN KEY ("courseBinId") REFERENCES "CourseBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
