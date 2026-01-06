-- CreateTable
CREATE TABLE "UserSession" (
    "session_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "login_time" TIMESTAMP(3) NOT NULL,
    "last_activity_time" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE INDEX "UserSession_user_id_idx" ON "UserSession"("user_id");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
