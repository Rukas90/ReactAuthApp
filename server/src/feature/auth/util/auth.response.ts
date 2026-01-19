import { Response } from "express"
import { setAccessTokenCookie, setRefreshTokenCookie } from "./auth.cookie"
import {
  generateFullAccessToken,
  generatePre2faAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_EXPIRATION,
} from "@shared/token"
import { User } from "@prisma/client"
import { hasMfaConfigured } from "@features/mfa"
import { AuthUser } from "@project/shared"

export const establishUserAuthSession = async (
  res: Response,
  user: User,
): Promise<AuthUser> => {
  const mfaActive = await hasMfaConfigured(user.id)

  const { accessToken, authUser } = mfaActive
    ? await generatePre2faAccessToken(user)
    : await generateFullAccessToken(user)

  const refreshToken = mfaActive ? null : await generateRefreshToken(user)

  setAuthSessionCookies(res, accessToken, refreshToken, authUser)
  return authUser
}
export const setAuthSessionCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string | null,
  authUser: AuthUser,
) => {
  setAccessTokenCookie(res, accessToken, authUser.expiresAt)

  if (!!refreshToken) {
    setRefreshTokenCookie(res, refreshToken, REFRESH_TOKEN_EXPIRATION)
  }
}
