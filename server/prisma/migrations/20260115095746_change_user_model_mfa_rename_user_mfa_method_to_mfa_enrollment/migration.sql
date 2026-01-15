/*
  Warnings:

  - You are about to drop the column `totp_active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserAuthMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MfaMethod" AS ENUM ('TOTP');

-- DropForeignKey
ALTER TABLE "UserAuthMethod" DROP CONSTRAINT "UserAuthMethod_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "totp_active";

-- DropTable
DROP TABLE "UserAuthMethod";

-- DropEnum
DROP TYPE "AuthMethod";

-- CreateTable
CREATE TABLE "MfaEnrollment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "method" "MfaMethod" NOT NULL,
    "configured" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MfaEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MfaEnrollment_user_id_idx" ON "MfaEnrollment"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "MfaEnrollment_user_id_method_key" ON "MfaEnrollment"("user_id", "method");

-- AddForeignKey
ALTER TABLE "MfaEnrollment" ADD CONSTRAINT "MfaEnrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
