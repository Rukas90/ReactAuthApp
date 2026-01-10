import {
  AccessTokenData,
  generateAccessToken,
  validateAccessToken,
} from "#lib/token/jwt.service.js"
import { AuthUser, TokenPair } from "#features/auth/utils/auth.type"
import { generateRefreshToken } from "#lib/token/refresh.service.js"
import { User } from "#prisma/client"

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
  const expiration = payload.exp

  if (!expiration) {
    return null
  }
  const user: AuthUser = {
    isVerified: payload.isVerified,
    otpPending: payload.otpPending,
    accessExpires: expiration,
  }
  return user
}
export const generateAuthTokens = async (
  user: User,
  data: AccessTokenData = {
    otpPending: user.tfa_active,
    isVerified: user.is_verified,
  }
) => {
  const accessToken = await generateAccessToken(user, data)
  const refreshToken = await generateRefreshToken(user)
  return {
    accessToken,
    refreshToken,
  } as TokenPair
}
