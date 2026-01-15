import { Response } from "express"
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookies.config"

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  clearAccessTokenCookie(res)
  res.cookie("accessToken", accessToken, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 1000,
  })
}
export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  clearRefreshTokenCookie(res)
  res.cookie("refreshToken", refreshToken, {
    ...REFRESH_TOKEN_COOKIE_OPTIONS,
    maxAge: 24 * 60 * 60 * 1000,
  })
}

export const clearAuthTokenCookies = (res: Response) => {
  clearAccessTokenCookie(res)
  clearRefreshTokenCookie(res)
}

const clearAccessTokenCookie = (res: Response) => {
  res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS)
}
const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS)
}
