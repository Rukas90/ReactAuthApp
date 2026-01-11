import { validateAccessToken } from "src/shared/token/jwt.service.js"
import { asyncRoute } from "src/shared/util/express.error.handler.js"
import { NextFunction, Request, Response } from "express"
import { UnauthenticatedError } from "@shared/errors/auth.error.js"

export const authenticateRequest = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const access = req.cookies.accessToken

    if (!access) {
      return next(new UnauthenticatedError())
    }
    const result = await validateAccessToken(access)

    if (!result.ok) {
      return next(new UnauthenticatedError())
    }
    const payload = result.data
    req.session.userId = payload.sub

    next()
  }
)
