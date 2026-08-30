-- AlterTable
ALTER TABLE "User" ADD COLUMN "privacy_consent_accepted_at" TIMESTAMP(3),
ADD COLUMN "privacy_policy_version" TEXT;
