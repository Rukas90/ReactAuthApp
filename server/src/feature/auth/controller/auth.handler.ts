import { NextFunction, Request, Response } from "express"
import { loginWithCredentials } from "../service/login.service"
import {
  clearAuthTokenCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../util/auth.cookie"
import {
  findRefreshToken,
  generateFullAccessToken,
  generatePre2faAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  revokeTokenFamily,
  validateRefreshToken,
} from "@shared/token"
import { asyncRoute } from "@shared/util"
import { UnexpectedError } from "@shared/errors"
import { createNewUser } from "../service/register.service"
import { getAuthUser } from "../service/auth.service"
import { hasMfaConfigured } from "@features/mfa"
import { SessionData } from "@project/shared"

export const loginHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const login = await loginWithCredentials(req.body.email, req.body.password)

    if (!login.ok) {
      return next(login.error)
    }
    const user = login.data

    const oldRefreshToken = req.cookies?.refreshToken

    if (oldRefreshToken) {
      const token = await findRefreshToken(oldRefreshToken)

      if (token.ok) {
        await revokeTokenFamily(token.data.family_id)
      }
    }
    if (await hasMfaConfigured(user.id)) {
      const accessToken = await generatePre2faAccessToken(user)

      sendAuthTokensResponse(
        accessToken,
        null,
        res,
        next,
        "Logged in successfully"
      )
      return
    }
    const accessToken = await generateFullAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    await sendAuthTokensResponse(
      accessToken,
      refreshToken,
      res,
      next,
      "Logged in successfully"
    )
  }
)
export const registerHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await createNewUser(req.body.email, req.body.password)

    if (!user.ok) {
      return next(user.error)
    }
    const accessToken = await generateFullAccessToken(user.data)
    const refreshToken = await generateRefreshToken(user.data)

    await sendAuthTokensResponse(
      accessToken,
      refreshToken,
      res,
      next,
      "Registered and logged in successfully"
    )
  }
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

    const accessToken = await generateFullAccessToken(currentToken.user)
    const refreshToken = await generateRefreshToken(
      currentToken.user,
      currentToken.family_id
    )
    await sendAuthTokensResponse(
      accessToken,
      refreshToken,
      res,
      next,
      "Session refreshed successfully"
    )
  }
)

const sendAuthTokensResponse = async (
  accessToken: string,
  refreshToken: string | null,
  res: Response,
  next: NextFunction,
  successMessage: string
) => {
  const user = await getAuthUser(accessToken)

  if (user === null) {
    return next(new UnexpectedError("Auth failed unexpectedly.", "AUTH_FAILED"))
  }
  setAccessTokenCookie(res, accessToken)

  if (!!refreshToken) {
    setRefreshTokenCookie(res, refreshToken)
  }
  res.ok({
    message: successMessage,
    user: user,
  })
}

export const logoutHandler = asyncRoute(async (req: Request, res: Response) => {
  const currentRefreshToken = req.cookies?.refreshToken

  if (currentRefreshToken) {
    const token = await findRefreshToken(currentRefreshToken)

    if (token.ok) {
      await revokeTokenFamily(token.data.family_id)
    }
  }
  clearAuthTokenCookies(res)
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
  }
)
