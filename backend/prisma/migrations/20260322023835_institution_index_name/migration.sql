/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE INDEX "Institution_name_idx" ON "Institution"("name");
