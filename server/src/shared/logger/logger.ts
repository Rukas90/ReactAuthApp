import chalk from "chalk"

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
} as const

export type LogLevel = keyof typeof LOG_LEVELS

const colors = {
  debug: chalk.gray,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  success: chalk.green,
}

const logger = {
  debug: (...data: any[]) => {
    if (canLog("debug")) {
      console.log(colors.info("[DEBUG]"), ...data)
    }
  },
  info: (...data: any[]) => {
    if (canLog("info")) {
      console.log(colors.info("[INFO]"), ...data)
    }
  },

  warn: (...data: any[]) => {
    if (canLog("warn")) {
      console.warn(colors.warn("[WARN]"), ...data)
    }
  },

  error: (...data: any[]) => {
    if (canLog("error")) {
      console.error(colors.error("[ERROR]"), ...data)
    }
  },
  success: (...data: any[]) => {
    if (canLog("info")) {
      console.log(colors.success("[SUCCESS]"), ...data)
    }
  },
  fail: (...data: any[]) => {
    if (canLog("error")) {
      console.error(colors.error("[FAIL]"), ...data)
    }
  },
}

const getLogLevel = (): LogLevel =>
  (process.env.LOG_LEVEL as LogLevel) ?? "info"

const canLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[getLogLevel()]
}

export default logger
