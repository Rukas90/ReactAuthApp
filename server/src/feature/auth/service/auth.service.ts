import { database } from "@base/app"
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
    scope: payload.scope,
    expiresAt: expirationInSeconds * 1000,
  }
  return user
}
export const hasMfaConfigured = async (userId: string) => {
  const enrollments = await database.client.mfaEnrollment.findMany({
    where: {
      user_id: userId,
    },
  })
  return enrollments.length > 0 && enrollments.some((e) => e.configured)
}
