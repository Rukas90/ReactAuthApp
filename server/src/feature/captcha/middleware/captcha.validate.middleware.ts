import { Request, Response, NextFunction } from "express"
import { asyncRoute } from "@shared/util"
import { CaptchaInvalidTokenError } from "../error/captcha.error"
import captchaService from "../service/captcha.service"
import { Result } from "@project/shared"

export const validateCaptchaToken = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.body.captchaToken

    if (token === null) {
      return next(new CaptchaInvalidTokenError())
    }
    const result = await captchaService.validateToken(token, req.ip as string)

    Result.tap(
      result,
      (_) => next(),
      (error) => next(error),
    )
  },
)
