/*
  Warnings:

  - You are about to drop the column `provider_name` on the `OAuth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_id]` on the table `OAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `OAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuth" DROP COLUMN "provider_name",
ADD COLUMN     "provider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OAuth_provider_provider_id_key" ON "OAuth"("provider", "provider_id");
