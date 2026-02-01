/*
  Warnings:

  - Added the required column `lookup_hash` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "lookup_hash" TEXT NOT NULL;
