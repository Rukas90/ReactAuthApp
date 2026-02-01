import { Response } from "express"
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookies.config"
import { refreshService } from "@shared/token"
import { AuthUser } from "@project/shared"

export const ACCESS_TOKEN_NAME = "accessToken"
export const REFRESH_TOKEN_NAME = "refreshToken"

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
  expiration: number,
) => {
  clearAccessTokenCookie(res)
  res.cookie(ACCESS_TOKEN_NAME, accessToken, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    maxAge: expiration,
  })
}
export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
  expiration: number,
) => {
  clearRefreshTokenCookie(res)
  res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
    ...REFRESH_TOKEN_COOKIE_OPTIONS,
    maxAge: expiration,
  })
}

export const clearAuthTokenCookies = (res: Response) => {
  clearAccessTokenCookie(res)
  clearRefreshTokenCookie(res)
}

const clearAccessTokenCookie = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_NAME, ACCESS_TOKEN_COOKIE_OPTIONS)
}
const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_NAME, REFRESH_TOKEN_COOKIE_OPTIONS)
}
export const setAuthSessionCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string | null | undefined,
  authUser: AuthUser,
) => {
  setAccessTokenCookie(res, accessToken, authUser.expiresAt)

  if (!!refreshToken) {
    setRefreshTokenCookie(
      res,
      refreshToken,
      refreshService.constants.REFRESH_TOKEN_EXPIRATION_MS,
    )
  }
}
