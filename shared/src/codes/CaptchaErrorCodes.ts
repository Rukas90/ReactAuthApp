export const CaptchaErrorCodes = {
  CAPTCHA_INVALID_TOKEN: "CAPTCHA_INVALID_TOKEN",
  CAPTCHA_FAILED_VALIDATION: "CAPTCHA_FAILED_VALIDATION",
} as const

export type CaptchaErrorCode =
  (typeof CaptchaErrorCodes)[keyof typeof CaptchaErrorCodes]
