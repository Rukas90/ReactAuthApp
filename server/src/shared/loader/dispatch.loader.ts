import { glob } from "glob"
import path from "path"
import { FeaturesDirectory, LoadOptions } from "./loader.config"
import { pathToFileURL } from "url"
import { Dispatch, dispatchRegistry } from "../dispatch"
import chalk from "chalk"
import logger from "../logger"

const DEFAULT_OPTIONS: LoadOptions = {
  pattern: "**/*.dispatch.ts",
}
export const registerDispatches = async (
  options: LoadOptions = DEFAULT_OPTIONS,
) => {
  const files = await glob(options.pattern, {
    cwd: options.path ?? FeaturesDirectory,
    absolute: true,
  })
  for (const file of files) {
    try {
      const fileUrl = pathToFileURL(file).href
      const module = await import(fileUrl)

      const DispatchClass = module.default as new () => Dispatch<any>

      if (
        typeof DispatchClass === "function" &&
        DispatchClass.prototype instanceof Dispatch
      ) {
        const instance = new DispatchClass()
        dispatchRegistry.register(instance)

        logger.success(
          chalk.blueBright("Registered dispatch:"),
          chalk.yellowBright(instance.name),
          "from:",
          chalk.gray(path.basename(file)),
        )
      }
    } catch (error) {
      logger.error("Failed to load dispatch from:", path.basename(file), error)
    }
  }
}
