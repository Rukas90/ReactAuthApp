import { Response } from "express"
import { TokenPair } from "./auth.type"
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookies.config"

export const setResponseTokenCookies = (res: Response, tokens: TokenPair) => {
  clearResponseTokenCookies(res)
  res
    .cookie("accessToken", tokens.accessToken, {
      ...ACCESS_TOKEN_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000,
    })
    .cookie("refreshToken", tokens.refreshToken, {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000,
    })
}
export const clearResponseTokenCookies = (res: Response) => {
  res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS)
  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS)
}
