/*
  Warnings:

  - You are about to drop the column `is_active` on the `UserSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "is_active",
ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false;
