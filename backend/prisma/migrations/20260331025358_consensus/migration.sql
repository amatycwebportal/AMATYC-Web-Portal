-- CreateEnum
CREATE TYPE "ConsensusResponseStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- CreateTable
CREATE TABLE "ConsensusResponse" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "institutionId" UUID NOT NULL,
    "rubricVersionId" UUID NOT NULL,
    "status" "ConsensusResponseStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "entries" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsensusResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsensusResponse_institutionId_idx" ON "ConsensusResponse"("institutionId");

-- CreateIndex
CREATE INDEX "ConsensusResponse_rubricVersionId_idx" ON "ConsensusResponse"("rubricVersionId");

-- CreateIndex
CREATE INDEX "ConsensusResponse_status_idx" ON "ConsensusResponse"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ConsensusResponse_userId_rubricVersionId_key" ON "ConsensusResponse"("userId", "rubricVersionId");

-- AddForeignKey
ALTER TABLE "ConsensusResponse" ADD CONSTRAINT "ConsensusResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsensusResponse" ADD CONSTRAINT "ConsensusResponse_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsensusResponse" ADD CONSTRAINT "ConsensusResponse_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "RubricVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
