/*
  Warnings:

  - You are about to drop the column `tfa_active` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('PASSWORD', 'TOTP');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tfa_active",
ADD COLUMN     "totp_active" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserAuthMethod" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "method" "AuthMethod" NOT NULL,
    "configured" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuthMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAuthMethod" ADD CONSTRAINT "UserAuthMethod_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
