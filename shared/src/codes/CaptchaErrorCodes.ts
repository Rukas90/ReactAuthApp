export const CaptchaErrorCodes = {
  CAPTCHA_INVALID_TOKEN: "CAPTCHA_INVALID_TOKEN",
} as const

export type CaptchaErrorCode =
  (typeof CaptchaErrorCodes)[keyof typeof CaptchaErrorCodes]
