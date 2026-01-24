export const UserErrorCodes = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
} as const

export type UserErrorCode = (typeof UserErrorCodes)[keyof typeof UserErrorCodes]
