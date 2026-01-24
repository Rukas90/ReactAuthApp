import { ValidationError } from "@shared/errors"
import { CaptchaErrorCodes } from "@project/shared"

export class CaptchaInvalidTokenError extends ValidationError {
  constructor() {
    super(
      "Captcha token is invalid, missing or expired.",
      CaptchaErrorCodes.CAPTCHA_INVALID_TOKEN,
    )
  }
}
