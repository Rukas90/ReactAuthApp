/*
  Warnings:

  - The primary key for the `UserSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `session_id` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the `BlockedSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Verification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `family_id` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `UserSession` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_user_id_fkey";

-- DropIndex
DROP INDEX "RefreshToken_family_id_idx";

-- DropIndex
DROP INDEX "RefreshToken_lookup_hash_idx";

-- DropIndex
DROP INDEX "RefreshToken_user_id_idx";

-- DropIndex
DROP INDEX "UserSession_user_id_idx";

-- AlterTable
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_pkey",
DROP COLUMN "session_id",
ADD COLUMN     "family_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "BlockedSession";

-- DropTable
DROP TABLE "Verification";

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_family_id_lookup_hash_idx" ON "RefreshToken"("user_id", "family_id", "lookup_hash");

-- CreateIndex
CREATE INDEX "UserSession_user_id_family_id_idx" ON "UserSession"("user_id", "family_id");
