import { type AuthUser } from "@project/shared"
import { validateAccessToken } from "@shared/token"

export const getAuthUser = async (
  accessToken?: string,
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
    verifiedEmail: payload.email_verified,
    authLevel: payload.auth_level,
    expiresAt: expirationInSeconds * 1000,
  }
  return user
}
