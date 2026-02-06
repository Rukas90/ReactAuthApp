/*
  Warnings:

  - A unique constraint covering the columns `[lookup_hash]` on the table `BackupCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lookup_hash` to the `BackupCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BackupCode" ADD COLUMN     "lookup_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BackupCode_lookup_hash_key" ON "BackupCode"("lookup_hash");
