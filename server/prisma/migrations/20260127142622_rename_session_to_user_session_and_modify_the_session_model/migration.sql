/*
  Warnings:

  - You are about to drop the column `device_type` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `last_activity_time` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `login_time` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `UserSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[family_id]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_agent` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_user_id_family_id_lookup_hash_idx";

-- DropIndex
DROP INDEX "UserSession_user_id_family_id_idx";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "revoked_at" TIMESTAMP(3),
ALTER COLUMN "revoked" SET DEFAULT false;

-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "device_type",
DROP COLUMN "last_activity_time",
DROP COLUMN "login_time",
DROP COLUMN "source",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "seen_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_agent" TEXT NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "RefreshToken_lookup_hash_idx" ON "RefreshToken"("lookup_hash");

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_family_id_idx" ON "RefreshToken"("user_id", "family_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_family_id_key" ON "UserSession"("family_id");

-- CreateIndex
CREATE INDEX "UserSession_user_id_idx" ON "UserSession"("user_id");
