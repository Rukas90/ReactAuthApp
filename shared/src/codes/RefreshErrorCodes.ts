export const RefreshErrorCodes = {
  REFRESH_TOKEN_INVALID: "REFRESH_TOKEN_INVALID",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  REFRESH_TOKEN_REUSED: "REFRESH_TOKEN_REUSED",
  REFRESH_TOKEN_NOT_FOUND: "REFRESH_TOKEN_NOT_FOUND",
} as const

export type RefreshErrorCode =
  (typeof RefreshErrorCodes)[keyof typeof RefreshErrorCodes]
