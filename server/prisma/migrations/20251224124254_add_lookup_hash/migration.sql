/*
  Warnings:

  - A unique constraint covering the columns `[lookup_hash]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lookup_hash` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "lookup_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_lookup_hash_key" ON "RefreshToken"("lookup_hash");
