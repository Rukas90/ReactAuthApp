import { NextFunction, Request, Response } from "express"
import { loginWithCredentials } from "../service/login.service"
import { clearAuthTokenCookies } from "../util/auth.cookie"
import {
  findRefreshToken,
  generateFullAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  revokeTokenFamily,
  validateRefreshToken,
} from "@shared/token"
import { asyncRoute } from "@shared/util"
import { createNewUser } from "../service/register.service"
import { getAuthUser } from "../service/auth.service"
import { SessionData } from "@project/shared"
import { setAuthSessionCookies } from "../util/auth.response"
import { establishUserAuthSession } from "@features/auth"

export const loginHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const login = await loginWithCredentials(req.body.email, req.body.password)

    if (!login.ok) {
      return next(login.error)
    }
    const user = login.data
    const oldRefreshToken: string = req.cookies?.refreshToken

    if (oldRefreshToken) {
      const token = await findRefreshToken(oldRefreshToken)

      if (token.ok) {
        await revokeTokenFamily(token.data.family_id)
      }
    }
    const authUser = await establishUserAuthSession(res, user)
    res.auth({
      user: authUser,
      message: "Logged in successfully.",
    })
  },
)
export const registerHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await createNewUser(req.body.email, req.body.password)

    if (!user.ok) {
      return next(user.error)
    }
    const { accessToken, authUser } = await generateFullAccessToken(user.data)
    const refreshToken = await generateRefreshToken(user.data)

    setAuthSessionCookies(res, accessToken, refreshToken, authUser)
    res.auth({
      user: authUser,
      message: "Registered and logged in successfully.",
    })
  },
)

export const refreshHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = await validateRefreshToken(req.cookies.refreshToken)

    if (!validation.ok) {
      clearAuthTokenCookies(res)
      return next(validation.error)
    }
    const currentToken = validation.data
    await revokeRefreshToken(currentToken.lookup_hash)

    const { accessToken, authUser } = await generateFullAccessToken(
      currentToken.user,
    )
    const refreshToken = await generateRefreshToken(
      currentToken.user,
      currentToken.family_id,
    )
    setAuthSessionCookies(res, accessToken, refreshToken, authUser)
    res.auth({
      user: authUser,
      message: "Session refreshed successfully.",
    })
  },
)

export const logoutHandler = asyncRoute(async (req: Request, res: Response) => {
  const currentRefreshToken = req.cookies?.refreshToken

  if (currentRefreshToken) {
    const token = await findRefreshToken(currentRefreshToken)

    if (token.ok) {
      await revokeTokenFamily(token.data.family_id)
    }
  }
  clearAuthTokenCookies(res)
  delete req.session.auth

  res.ok("Logged out successfully")
})

export const authUserHandler = asyncRoute(
  async (req: Request, res: Response) => {
    const accessToken = req.cookies?.accessToken
    const refreshToken = req.cookies?.refreshToken

    const user = await getAuthUser(accessToken)
    const canRefresh = !user && !!refreshToken

    if (!user && !canRefresh) {
      clearAuthTokenCookies(res)
    }
    const session: SessionData = { user, canRefresh }
    res.ok(session)
  },
)
