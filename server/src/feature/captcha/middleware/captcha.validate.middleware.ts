import { Request, Response, NextFunction } from "express"
import { asyncRoute } from "@shared/util"
import { CaptchaInvalidTokenError } from "../error/captcha.error"

export const validateCaptchaToken = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.body.captchaToken

    if (token === null) {
      return next(new CaptchaInvalidTokenError())
    }
    next()
  },
)
