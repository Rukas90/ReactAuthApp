import logger from "@shared/logger"
import chalk from "chalk"
import IORedis from "ioredis"

const redis = new IORedis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
})

redis.on("connect", () => {
  logger.success(chalk.red("Redis"), "connected on port", chalk.gray("6379"))
})

redis.on("ready", () => {
  logger.info(chalk.red("Redis"), "is ready.")
})

redis.on("error", (err) => {
  logger.error(chalk.red("Redis"), "error:", err)
})

redis.on("close", () => {
  logger.info(chalk.red("Redis"), "closed.")
})

export default redis
