export const RETRY_AFTER_MS_FIELD_NAME = "retryAfterMs" as const

export type SendEmailVerifyResponseDto = {
  [RETRY_AFTER_MS_FIELD_NAME]: number
} & {
  message: string
}
