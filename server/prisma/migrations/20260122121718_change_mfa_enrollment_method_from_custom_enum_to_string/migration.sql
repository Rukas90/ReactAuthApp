/*
  Warnings:

  - Changed the type of `method` on the `MfaEnrollment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MfaEnrollment" DROP COLUMN "method",
ADD COLUMN     "method" TEXT NOT NULL;

-- DropEnum
DROP TYPE "MfaMethod";

-- CreateIndex
CREATE UNIQUE INDEX "MfaEnrollment_user_id_method_key" ON "MfaEnrollment"("user_id", "method");
