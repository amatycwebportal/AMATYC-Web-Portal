/*
  Warnings:

  - A unique constraint covering the columns `[binName]` on the table `PredefinedCourseBin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PredefinedCourseBin_binName_key" ON "PredefinedCourseBin"("binName");
