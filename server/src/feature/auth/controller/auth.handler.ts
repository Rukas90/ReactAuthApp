import { NextFunction, Request, Response } from "express"
import { loginWithCredentials } from "../service/login.service"
import {
  clearResponseTokenCookies,
  setResponseTokenCookies,
} from "../util/auth.cookie"
import {
  findRefreshToken,
  revokeRefreshToken,
  revokeTokenFamily,
  validateRefreshToken,
} from "@shared/token"
import { asyncRoute } from "@shared/util"
import { UnexpectedError } from "@shared/errors"
import { createNewUser } from "../service/register.service"
import { generateAuthTokens, getAuthUser } from "../service/auth.service"
import { SessionData, TokenPair } from "../util/auth.type"

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
    const tokens = await generateAuthTokens(user)

    await sendAuthResponse(tokens, res, next, "Logged in successfully")
  }
)
export const registerHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await createNewUser(req.body.email, req.body.password)

    if (!user.ok) {
      return next(user.error)
    }
    const tokens = await generateAuthTokens(user.data)

    await sendAuthResponse(
      tokens,
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
      clearResponseTokenCookies(res)
      return next(validation.error)
    }
    const currentToken = validation.data

    await revokeRefreshToken(currentToken.lookup_hash)

    const tokens = await generateAuthTokens(
      currentToken.user,
      currentToken.family_id
    )
    await sendAuthResponse(tokens, res, next, "Session refreshed successfully")
  }
)

const sendAuthResponse = async (
  tokens: TokenPair,
  res: Response,
  next: NextFunction,
  successMessage: string
) => {
  const accessToken = tokens.accessToken
  const refreshToken = tokens.refreshToken

  const user = await getAuthUser(accessToken, refreshToken)

  if (user === null) {
    return next(new UnexpectedError("Auth failed unexpectedly.", "AUTH_FAILED"))
  }
  setResponseTokenCookies(res, tokens)

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
  clearResponseTokenCookies(res)
  res.ok("Logged out successfully")
})

export const authUserHandler = asyncRoute(
  async (req: Request, res: Response) => {
    const accessToken = req.cookies?.accessToken
    const refreshToken = req.cookies?.refreshToken

    const user = await getAuthUser(accessToken, refreshToken)
    const canRefresh = !user && !!refreshToken

    if (!user && !canRefresh) {
      clearResponseTokenCookies(res)
    }
    const session: SessionData = { user, canRefresh }

    res.ok(session)
  }
)
