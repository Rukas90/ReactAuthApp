/*
  Warnings:

  - You are about to drop the column `metadata` on the `MfaEnrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MfaEnrollment" DROP COLUMN "metadata",
ADD COLUMN     "credentials" JSONB;
