-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "assign_all_rubrics_on_accept" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';
