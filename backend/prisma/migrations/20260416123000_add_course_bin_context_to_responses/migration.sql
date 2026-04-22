/*
  Warnings:

  - A unique index covering the columns `[userId,scaleVersionId,rubricVersionId,courseBinId]` on the table `Response`
    will be added for course-bin scoped responses. If there are existing duplicates for a non-null `courseBinId`,
    this will fail.
  - A unique index covering the columns `[userId,scaleVersionId,rubricVersionId]` on the table `Response`
    will be added for global responses where `courseBinId` is null. If there are existing duplicates for global
    responses, this will fail.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN "courseBinId" UUID;

-- CreateIndex
CREATE INDEX "Response_courseBinId_idx" ON "Response"("courseBinId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_userId_scaleVersionId_rubricVersionId_courseBinId_key"
ON "Response"("userId", "scaleVersionId", "rubricVersionId", "courseBinId")
WHERE "courseBinId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Response_userId_scaleVersionId_rubricVersionId_global_key"
ON "Response"("userId", "scaleVersionId", "rubricVersionId")
WHERE "courseBinId" IS NULL;

-- AddForeignKey
ALTER TABLE "Response"
ADD CONSTRAINT "Response_courseBinId_fkey"
FOREIGN KEY ("courseBinId") REFERENCES "CourseBin"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
