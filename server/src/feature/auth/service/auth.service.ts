import {
  AccessTokenData,
  generateAccessToken,
  validateAccessToken,
  generateRefreshToken,
} from "@shared/token"
import { User } from "@prisma/client"
import type { AuthUser, TokenPair } from "../util/auth.type"

export const getAuthUser = async (
  accessToken?: string,
  refreshToken?: string
): Promise<AuthUser | null> => {
  if (!accessToken || !refreshToken) {
    console.log("Missing")
    return null
  }
  const result = await validateAccessToken(accessToken)

  if (!result.ok) {
    console.log("Not Valid")
    return null
  }
  const payload = result.data
  const expirationInSeconds = payload.exp

  if (!expirationInSeconds) {
    console.log("Expired")
    return null
  }
  const user: AuthUser = {
    verifiedEmail: payload.verifiedEmail,
    otpPending: payload.otpPending,
    expiresAt: expirationInSeconds * 1000, // Convert to milliseconds
  }
  return user
}
export const generateAuthTokens = async (
  user: User,
  familyId?: string,
  data: AccessTokenData = {
    otpPending: user.tfa_active,
    verifiedEmail: user.is_verified,
  }
) => {
  const accessToken = await generateAccessToken(user.id, data)
  const refreshToken = await generateRefreshToken(user.id, familyId)
  return {
    accessToken,
    refreshToken,
  } as TokenPair
}
