/*
  Warnings:

  - You are about to drop the column `courseId` on the `Response` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_courseId_fkey";

-- DropIndex
DROP INDEX "Response_courseId_idx";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "courseId",
ADD COLUMN     "predefinedBinId" UUID;

-- CreateIndex
CREATE INDEX "Response_predefinedBinId_idx" ON "Response"("predefinedBinId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_predefinedBinId_fkey" FOREIGN KEY ("predefinedBinId") REFERENCES "PredefinedCourseBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
