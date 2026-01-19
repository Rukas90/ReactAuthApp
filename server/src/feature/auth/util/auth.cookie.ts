import { Response } from "express"
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookies.config"
import ms from "ms"

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
  expiration: number
) => {
  clearAccessTokenCookie(res)
  res.cookie("accessToken", accessToken, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    maxAge: expiration,
  })
}
export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
  expiration: number
) => {
  clearRefreshTokenCookie(res)
  res.cookie("refreshToken", refreshToken, {
    ...REFRESH_TOKEN_COOKIE_OPTIONS,
    maxAge: expiration,
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
