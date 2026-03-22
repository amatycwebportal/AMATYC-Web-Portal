-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- CreateTable
CREATE TABLE "_InvitationCourseBins" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_InvitationCourseBins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InvitationCourseBins_B_index" ON "_InvitationCourseBins"("B");

-- AddForeignKey
ALTER TABLE "_InvitationCourseBins" ADD CONSTRAINT "_InvitationCourseBins_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseBin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitationCourseBins" ADD CONSTRAINT "_InvitationCourseBins_B_fkey" FOREIGN KEY ("B") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
