/*
  Warnings:

  - The values [TOTP] on the enum `MfaMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MfaMethod_new" AS ENUM ('totp');
ALTER TABLE "MfaEnrollment" ALTER COLUMN "method" TYPE "MfaMethod_new" USING ("method"::text::"MfaMethod_new");
ALTER TYPE "MfaMethod" RENAME TO "MfaMethod_old";
ALTER TYPE "MfaMethod_new" RENAME TO "MfaMethod";
DROP TYPE "public"."MfaMethod_old";
COMMIT;
