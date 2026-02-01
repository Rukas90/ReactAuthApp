/*
  Warnings:

  - You are about to drop the column `metadata` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Verification` table. All the data in the column will be lost.
  - Added the required column `dispatch_type` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "metadata",
DROP COLUMN "type",
ADD COLUMN     "dispatch_type" TEXT NOT NULL,
ADD COLUMN     "payload_encrypted" TEXT;

-- CreateIndex
CREATE INDEX "Verification_user_id_dispatch_type_idx" ON "Verification"("user_id", "dispatch_type");
