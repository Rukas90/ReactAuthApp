import { Queue } from "bullmq"
import { redis } from "@base/app"
import { VerificationJobData } from "./verification.type"

export const VERIFICATION_QUEUE = "sendVerificationEmail"

const verificationQueue = new Queue(VERIFICATION_QUEUE, {
  connection: redis.connection,
})

export const dispatchVerification = async (data: VerificationJobData) => {
  await verificationQueue.add(VERIFICATION_QUEUE, data)
}
