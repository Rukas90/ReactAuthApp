export const SessionErrorCodes = {
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
} as const

export type SessionErrorCode =
  (typeof SessionErrorCodes)[keyof typeof SessionErrorCodes]
