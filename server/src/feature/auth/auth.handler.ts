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

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await login(
    req.body.email,
    req.body.password,
    req.cookies?.refreshToken
  )

  Result.tap(
    result,
    (tokens) => {
      setResponseTokenCookies(res, tokens)
      res.ok("Logged in successfully")
    },
    (error) => next(error)
  )
}
export const registerHandler = async (req: Request, res: Response) => {
  const tokens = await register(req.body.email, req.body.password)

  setResponseTokenCookies(res, tokens)
  res.ok("Registered and logged in successfully")
}
export const logoutHandler = async (req: Request, res: Response) => {
  const currentRefreshToken = req.cookies?.refreshToken

  if (currentRefreshToken) {
    const tokenHash = await generateLookupHash(currentRefreshToken)
    console.log(tokenHash)
    await revokeRefreshToken(tokenHash)
  }
  clearResponseTokenCookies(res)
  res.ok("Logged out successfully")
}
export const authStatusHandler = async (
  req: Request,
  res: Response
): Promise<Result<string>> => {
  const refreshCookie = req.cookies.refreshToken

  if (!refreshCookie) {
  }
  const accessCookie = req.cookies.accessToken

  return Result.success("Yo")
}
