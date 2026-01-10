import { NextFunction, Request, Response } from "express"
import { login } from "../service/login.service"
import {
  clearResponseTokenCookies,
  setResponseTokenCookies,
} from "../utils/auth.cookie"
import { register } from "../service/register.service"
import {
  generateLookupHash,
  revokeRefreshToken,
} from "#lib/token/refresh.service.js"
import { asyncRoute } from "#lib/util/express.error.handler.js"
import { getAuthUser } from "../service/auth.service"
import { UnexpectedError } from "#lib/common/domain.error.js"
import { TokenPair } from "../utils/auth.type"

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
