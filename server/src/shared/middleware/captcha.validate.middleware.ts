import { Request, Response, NextFunction } from "express"
import { ResourceMissingError } from "@shared/errors"
import { asyncRoute } from "@shared/util"

export const validateCaptchaToken = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.body.captchaToken

    if (token === null) {
      return next(
        new ResourceMissingError(
          "Captcha token is not provided!",
          "INVALID_CAPTCHA"
        )
      )
    }
    next()
  }
)
