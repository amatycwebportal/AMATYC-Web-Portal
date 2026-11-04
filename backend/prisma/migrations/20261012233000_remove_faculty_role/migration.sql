-- Faculty accounts are users. Recreate the role enum without FACULTY.
CREATE TYPE "UserRole_new" AS ENUM ('PROJECT_LEAD', 'LOCAL_LEADER', 'USER');

ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "UserRole_new"
  USING (
    CASE
      WHEN "role"::text = 'FACULTY' THEN 'USER'
      ELSE "role"::text
    END
  )::"UserRole_new";

ALTER TABLE "Invitation"
  ALTER COLUMN "role" TYPE "UserRole_new"
  USING (
    CASE
      WHEN "role"::text = 'FACULTY' THEN 'USER'
      ELSE "role"::text
    END
  )::"UserRole_new";

DROP TYPE "UserRole";

ALTER TYPE "UserRole_new" RENAME TO "UserRole";
