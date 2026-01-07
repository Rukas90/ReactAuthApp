import { validateAccessToken } from "#lib/token/jwt.service.js"
import { AccessDeniedError } from "#lib/common/domain.error.js"
import { asyncRoute } from "#lib/util/express.error.handler.js"
import { NextFunction, Request, Response } from "express"

export const authenticateRequest = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.cookies.accessToken

    if (!token) {
      return next(new AccessDeniedError("No token provided", "NO_TOKEN"))
    }
    const payload = await validateAccessToken(token)
    const userId = payload.sub

    if (!userId) {
      return next(
        new AccessDeniedError("Invalid token payload", "INVALID_TOKEN_PAYLOAD")
      )
    }
    req.session.userId = userId
    next()
  }
)
