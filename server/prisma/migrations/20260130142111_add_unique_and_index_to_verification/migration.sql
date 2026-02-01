/*
  Warnings:

  - A unique constraint covering the columns `[code_hash]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lookup_hash]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verification_code_hash_key" ON "Verification"("code_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_lookup_hash_key" ON "Verification"("lookup_hash");

-- CreateIndex
CREATE INDEX "Verification_user_id_lookup_hash_idx" ON "Verification"("user_id", "lookup_hash");
