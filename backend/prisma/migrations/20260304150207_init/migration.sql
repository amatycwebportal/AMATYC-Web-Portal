-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROJECT_LEAD', 'LOCAL_LEADER', 'FACULTY');

-- CreateTable
CREATE TABLE "Institution" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "institutionId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubric" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scale" (
    "id" UUID NOT NULL,
    "rubricId" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "editable" BOOLEAN NOT NULL DEFAULT true,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredefinedCourseBin" (
    "id" UUID NOT NULL,
    "binName" TEXT NOT NULL,

    CONSTRAINT "PredefinedCourseBin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseBin" (
    "id" UUID NOT NULL,
    "institutionId" UUID NOT NULL,
    "predefinedBinId" UUID NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "CourseBin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" UUID NOT NULL,
    "courseBinId" UUID NOT NULL,
    "courseNumber" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScaleBin" (
    "scaleId" UUID NOT NULL,
    "predefinedBinId" UUID NOT NULL,

    CONSTRAINT "ScaleBin_pkey" PRIMARY KEY ("scaleId","predefinedBinId")
);

-- CreateTable
CREATE TABLE "UserCourseBin" (
    "userId" UUID NOT NULL,
    "courseBinId" UUID NOT NULL,

    CONSTRAINT "UserCourseBin_pkey" PRIMARY KEY ("userId","courseBinId")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scaleId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Scale_rubricId_idx" ON "Scale"("rubricId");

-- CreateIndex
CREATE INDEX "CourseBin_institutionId_idx" ON "CourseBin"("institutionId");

-- CreateIndex
CREATE INDEX "CourseBin_predefinedBinId_idx" ON "CourseBin"("predefinedBinId");

-- CreateIndex
CREATE INDEX "Course_courseBinId_idx" ON "Course"("courseBinId");

-- CreateIndex
CREATE INDEX "ScaleBin_predefinedBinId_idx" ON "ScaleBin"("predefinedBinId");

-- CreateIndex
CREATE INDEX "UserCourseBin_courseBinId_idx" ON "UserCourseBin"("courseBinId");

-- CreateIndex
CREATE INDEX "Response_userId_idx" ON "Response"("userId");

-- CreateIndex
CREATE INDEX "Response_scaleId_idx" ON "Response"("scaleId");

-- CreateIndex
CREATE INDEX "Response_courseId_idx" ON "Response"("courseId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scale" ADD CONSTRAINT "Scale_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "Rubric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBin" ADD CONSTRAINT "CourseBin_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBin" ADD CONSTRAINT "CourseBin_predefinedBinId_fkey" FOREIGN KEY ("predefinedBinId") REFERENCES "PredefinedCourseBin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_courseBinId_fkey" FOREIGN KEY ("courseBinId") REFERENCES "CourseBin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleBin" ADD CONSTRAINT "ScaleBin_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "Scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleBin" ADD CONSTRAINT "ScaleBin_predefinedBinId_fkey" FOREIGN KEY ("predefinedBinId") REFERENCES "PredefinedCourseBin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourseBin" ADD CONSTRAINT "UserCourseBin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourseBin" ADD CONSTRAINT "UserCourseBin_courseBinId_fkey" FOREIGN KEY ("courseBinId") REFERENCES "CourseBin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "Scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
