import {
  AccessTokenData,
  generateAccessToken,
  validateAccessToken,
  generateRefreshToken,
} from "@shared/token"
import { User } from "@prisma/client"
import type { AuthUser, TokenPair } from "../util/auth.type"

export const getAuthUser = async (
  accessToken?: string
): Promise<AuthUser | null> => {
  if (!accessToken) {
    return null
  }
  const result = await validateAccessToken(accessToken)

  if (!result.ok) {
    return null
  }
  const payload = result.data
  const expirationInSeconds = payload.exp

  if (!expirationInSeconds) {
    return null
  }
  const user: AuthUser = {
    isVerified: payload.isVerified,
    otpPending: payload.otpPending,
    accessExpires: expirationInSeconds * 1000, // Convert to milliseconds
  }
  return user
}
export const generateAuthTokens = async (
  user: User,
  familyId?: string,
  data: AccessTokenData = {
    otpPending: user.tfa_active,
    isVerified: user.is_verified,
  }
) => {
  const accessToken = await generateAccessToken(user.id, data)
  const refreshToken = await generateRefreshToken(user.id, familyId)
  return {
    accessToken,
    refreshToken,
  } as TokenPair
}
