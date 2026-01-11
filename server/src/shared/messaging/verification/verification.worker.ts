import { redis } from "@base/app"
import { VERIFICATION_QUEUE } from "./verification.queue"
import { Job, Worker } from "bullmq"
import { VerificationJobData } from "./verification.type"

const processJob = async (job: Job) => {
  const data: VerificationJobData = job.data
  // ...
}
export const startVerificationWorker = () => {
  return new Worker(VERIFICATION_QUEUE, processJob, {
    connection: redis.connection,
    concurrency: 5,
  })
}
