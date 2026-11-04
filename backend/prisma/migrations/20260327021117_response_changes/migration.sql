-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_courseId_fkey";

-- DropIndex
DROP INDEX "Response_userId_scaleVersionId_rubricVersionId_courseId_key";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
