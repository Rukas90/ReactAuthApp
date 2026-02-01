import { glob } from "glob"
import path from "path"
import { FeaturesDirectory, LoadOptions } from "./loader.config"
import { pathToFileURL } from "url"
import { Worker } from "bullmq"
import chalk from "chalk"
import logger from "../logger"

type WorkerFactory = () => Worker<any, void, string>

const DEFAULT_OPTIONS: LoadOptions = {
  pattern: "**/*.worker.ts",
}
export const startWorkers = async (options: LoadOptions = DEFAULT_OPTIONS) => {
  const files = await glob(options.pattern, {
    cwd: options.path ?? FeaturesDirectory,
    absolute: true,
  })
  for (const file of files) {
    try {
      const fileUrl = pathToFileURL(file).href
      const module = await import(fileUrl)

      const startWorker = module.default as WorkerFactory

      if (typeof startWorker === "function") {
        startWorker()
        logger.success(
          chalk.magentaBright("Started worker"),
          "from:",
          chalk.gray(path.basename(file)),
        )
      }
    } catch (error) {
      logger.error(
        "Failed to load controller from:",
        path.basename(file),
        error,
      )
    }
  }
}
