import { NextFunction, Request, Response } from "express"
import { login } from "./login.service"
import {
  clearResponseTokenCookies,
  setResponseTokenCookies,
} from "./auth.cookie"
import { register } from "./register.service"
import {
  generateLookupHash,
  revokeRefreshToken,
} from "#lib/token/refresh.service.js"
import { Result } from "#lib/common/result.js"
import { asyncRoute } from "#lib/util/express.error.handler.js"

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
    setResponseTokenCookies(res, result.data)
    res.ok("Logged in successfully")
  }
)

export const registerHandler = asyncRoute(
  async (req: Request, res: Response) => {
    const tokens = await register(req.body.email, req.body.password)

    setResponseTokenCookies(res, tokens)
    res.ok("Registered and logged in successfully")
  }
)

export const logoutHandler = asyncRoute(async (req: Request, res: Response) => {
  const currentRefreshToken = req.cookies?.refreshToken

  if (currentRefreshToken) {
    const tokenHash = await generateLookupHash(currentRefreshToken)
    console.log(tokenHash)
    await revokeRefreshToken(tokenHash)
  }
  clearResponseTokenCookies(res)
  res.ok("Logged out successfully")
})

export const authStatusHandler = asyncRoute(
  async (req: Request, res: Response): Promise<Result<string>> => {
    const refreshCookie = req.cookies.refreshToken

    if (!refreshCookie) {
    }
    const accessCookie = req.cookies.accessToken

    return Result.success("Yo")
  }
)
