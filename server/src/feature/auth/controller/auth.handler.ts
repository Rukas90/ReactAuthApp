import { NextFunction, Request, Response } from "express"
import loginService from "../service/login.service"
import {
  ACCESS_TOKEN_NAME,
  clearAuthTokenCookies,
  REFRESH_TOKEN_NAME,
  setAuthSessionCookies,
} from "../util/auth.cookie"
import { refreshService } from "@shared/token"
import { asyncRoute } from "@shared/util"
import registerService from "../service/register.service"
import authService from "../service/auth.service"
import { SessionData } from "@project/shared"
import { extractSessionContext, sessionService } from "@features/session"
import { userService } from "@features/user"
import { generateCsrfCookie } from "@features/csrf"

export const loginHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const login = await loginService.loginWithCredentials(
      req.body.email,
      req.body.password,
    )

    if (!login.ok) {
      return next(login.error)
    }
    const user = login.data
    const oldRefreshToken: string = req.cookies?.[REFRESH_TOKEN_NAME]

    if (oldRefreshToken) {
      const token = await refreshService.findRefreshToken(oldRefreshToken)

      if (token.ok) {
        await authService.revokeSessionFamily(token.data.family_id)
      }
    }
    const context = extractSessionContext(req)

    const { accessToken, refreshToken, authUser } =
      await authService.establishUserAuthSession(user, context)

    setAuthSessionCookies(res, accessToken, refreshToken, authUser)
    generateCsrfCookie(res)

    res.auth({
      user: authUser,
      message: "Logged in successfully.",
    })
  },
)
export const registerHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await registerService.createNewUser(
      req.body.email,
      req.body.password,
    )

    if (!user.ok) {
      return next(user.error)
    }
    const context = extractSessionContext(req)

    const { accessToken, refreshToken, authUser } =
      await authService.createUserAuthSession(user.data, context)

    setAuthSessionCookies(res, accessToken, refreshToken, authUser)

    await userService.createEmailVerifyVerification(
      user.data.id,
      user.data.email,
    )
    generateCsrfCookie(res)

    res.auth({
      user: authUser,
      message: "Registered and logged in successfully.",
    })
  },
)

export const refreshHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = await refreshService.validateRefreshToken(
      req.cookies?.[REFRESH_TOKEN_NAME],
    )

    if (!validation.ok) {
      clearAuthTokenCookies(res)
      return next(validation.error)
    }
    const currentToken = validation.data
    await refreshService.revokeRefreshToken(currentToken.lookup_hash)

    const session = await sessionService.getSession({
      family_id: currentToken.family_id,
    })
    if (!session.ok) {
      return session
    }
    const { accessToken, refreshToken, refreshExpiryDate, authUser } =
      await authService.createUserAuthSession(
        currentToken.user,
        undefined,
        currentToken.family_id,
        session.data,
      )

    await sessionService.refreshSession(
      currentToken.family_id,
      currentToken.user.id,
      refreshExpiryDate,
    )
    setAuthSessionCookies(res, accessToken, refreshToken, authUser)

    res.auth({
      user: authUser,
      message: "Session refreshed successfully.",
    })
  },
)

export const logoutHandler = asyncRoute(async (req: Request, res: Response) => {
  const currentRefreshToken = req.cookies?.[REFRESH_TOKEN_NAME]

  if (currentRefreshToken) {
    const token = await refreshService.findRefreshToken(currentRefreshToken)

    if (token.ok) {
      await authService.revokeSessionFamily(token.data.family_id)
    }
  }
  clearAuthTokenCookies(res)
  delete req.session.auth

  generateCsrfCookie(res)
  res.ok("Logged out successfully")
})

export const authUserHandler = asyncRoute(
  async (req: Request, res: Response) => {
    const accessToken = req.cookies?.[ACCESS_TOKEN_NAME]
    const refreshToken = req.cookies?.[REFRESH_TOKEN_NAME]

    const user = await authService.getAuthUser(accessToken)
    const canRefresh = !user && !!refreshToken

    if (!user && !canRefresh) {
      clearAuthTokenCookies(res)
    }
    const session: SessionData = { user, canRefresh }
    res.ok(session)
  },
)
