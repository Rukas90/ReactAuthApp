import { NextFunction, Request, Response } from "express"
import { login } from "../service/login.service"
import {
  clearResponseTokenCookies,
  setResponseTokenCookies,
} from "../util/auth.cookie"
import { generateLookupHash, revokeRefreshToken } from "@shared/token"
import { asyncRoute } from "@shared/util"
import { UnexpectedError } from "@shared/errors"
import { register } from "../service/register.service"
import { getAuthUser } from "../service/auth.service"
import { TokenPair } from "../util/auth.type"

export const loginHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await login(
      req.body.email,
      req.body.password,
      req.cookies?.refreshToken
    )
    if (!result.ok) {
      return next(result.error)
    }
    await sendAuthResponse(result.data, res, next, "Logged in successfully")
  }
)
export const registerHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await register(req.body.email, req.body.password)

    if (!result.ok) {
      return next(result.error)
    }
    await sendAuthResponse(
      result.data,
      res,
      next,
      "Registered and logged in successfully"
    )
  }
)

const sendAuthResponse = async (
  tokens: TokenPair,
  res: Response,
  next: NextFunction,
  successMessage: string
) => {
  const accessToken = tokens.accessToken
  const user = await getAuthUser(accessToken)

  if (user === null) {
    return next(
      new UnexpectedError("Could not login successfully.", "LOGIN_FAILED")
    )
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
    const tokenHash = await generateLookupHash(currentRefreshToken)
    await revokeRefreshToken(tokenHash)
  }
  clearResponseTokenCookies(res)
  res.ok("Logged out successfully")
})

export const authUserHandler = asyncRoute(
  async (req: Request, res: Response) => {
    const user = await getAuthUser(req.cookies.accessToken)
    res.ok(user)
  }
)

export const refreshHandler = asyncRoute(
  async (req: Request, res: Response) => {
    const user = await getAuthUser(req.cookies.accessToken)
    res.ok(user)
  }
)
