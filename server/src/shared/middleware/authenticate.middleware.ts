import { validateAccessToken } from "src/shared/token/jwt.service.js"
import { asyncRoute } from "src/shared/util/express.error.handler.js"
import { NextFunction, Request, Response } from "express"
import { UnauthenticatedError } from "@shared/errors/auth.error.js"
import { AuthSession } from "../util/authenticated.request"

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

    if (!payload.sub || !payload.exp) {
      return next(new UnauthenticatedError())
    }
    const auth: AuthSession = {
      userId: payload.sub,
      expiresAt: payload.exp,
      claims: {
        auth_level: payload.auth_level,
        email_verified: payload.email_verified,
        scope: payload.scope,
      },
    }
    req.session.auth = auth
    next()
  },
)
