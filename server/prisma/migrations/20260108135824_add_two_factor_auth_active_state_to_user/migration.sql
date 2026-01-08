-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tfa_active" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "RefreshToken_lookup_hash_idx" ON "RefreshToken"("lookup_hash");
