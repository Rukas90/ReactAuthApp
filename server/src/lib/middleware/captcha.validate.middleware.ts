import { ResourceMissingError } from "#lib/common/domain.error.js"
import { asyncRoute } from "#lib/util/express.error.handler.js"
import { Request, Response, NextFunction } from "express"

export const validateCaptchaToken = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.body.captchaToken

    if (token === null) {
      throw new ResourceMissingError(
        "Captcha token is not provided!",
        "INVALID_CAPTCHA"
      )
    }
    next()
  }
)
