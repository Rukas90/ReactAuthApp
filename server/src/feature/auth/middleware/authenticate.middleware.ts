import { NextFunction, Request, Response } from "express"
import { AuthUnauthenticatedError } from "../error/auth.error"
import { asyncRoute, AuthSession } from "@shared/util"
import { validateAccessToken } from "@shared/token"

export const authenticateRequest = asyncRoute(
  async (req: Request, _: Response, next: NextFunction) => {
    const access = req.cookies.accessToken

    if (!access) {
      return next(new AuthUnauthenticatedError())
    }
    const result = await validateAccessToken(access)

    if (!result.ok) {
      return next(new AuthUnauthenticatedError())
    }
    const payload = result.data

    if (!payload.sub || !payload.exp) {
      return next(new AuthUnauthenticatedError())
    }
    const auth: AuthSession = {
      userId: payload.sub,
      expiresAt: payload.exp,
      claims: {
        email_verified: payload.email_verified,
        scope: payload.scope,
      },
    }
    req.session.auth = auth
    next()
  },
)
