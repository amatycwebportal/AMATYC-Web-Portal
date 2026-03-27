/*
  Warnings:

  - You are about to drop the column `scaleId` on the `Response` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,scaleVersionId,rubricVersionId,courseId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_scaleId_fkey";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "scaleId",
ADD COLUMN     "status" "ResponseStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX "Response_userId_scaleVersionId_rubricVersionId_courseId_key" ON "Response"("userId", "scaleVersionId", "rubricVersionId", "courseId");
