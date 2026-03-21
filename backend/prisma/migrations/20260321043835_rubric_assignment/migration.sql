-- CreateTable
CREATE TABLE "_UserAssignedRubrics" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserAssignedRubrics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserInProgressRubrics" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserInProgressRubrics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserCompletedRubrics" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserCompletedRubrics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserAssignedRubrics_B_index" ON "_UserAssignedRubrics"("B");

-- CreateIndex
CREATE INDEX "_UserInProgressRubrics_B_index" ON "_UserInProgressRubrics"("B");

-- CreateIndex
CREATE INDEX "_UserCompletedRubrics_B_index" ON "_UserCompletedRubrics"("B");

-- AddForeignKey
ALTER TABLE "_UserAssignedRubrics" ADD CONSTRAINT "_UserAssignedRubrics_A_fkey" FOREIGN KEY ("A") REFERENCES "Rubric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAssignedRubrics" ADD CONSTRAINT "_UserAssignedRubrics_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInProgressRubrics" ADD CONSTRAINT "_UserInProgressRubrics_A_fkey" FOREIGN KEY ("A") REFERENCES "Rubric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInProgressRubrics" ADD CONSTRAINT "_UserInProgressRubrics_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompletedRubrics" ADD CONSTRAINT "_UserCompletedRubrics_A_fkey" FOREIGN KEY ("A") REFERENCES "Rubric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompletedRubrics" ADD CONSTRAINT "_UserCompletedRubrics_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
