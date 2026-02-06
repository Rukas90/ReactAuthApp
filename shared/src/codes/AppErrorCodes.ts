export const AppErrorCodes = {
  APP_DATABASE_ERROR: "APP_DATABASE_ERROR",
} as const

export type AppErrorCode = (typeof AppErrorCodes)[keyof typeof AppErrorCodes]
