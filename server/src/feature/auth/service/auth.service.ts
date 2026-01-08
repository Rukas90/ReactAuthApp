import { validateAccessToken } from "#lib/token/jwt.service.js"
import { AuthStatus } from "#features/auth/utils/auth.type"

const UNAUTHENTICATED = (): AuthStatus => {
  return {
    state: "unauthenticated",
    isVerified: false,
  }
}
export const getAuthStatus = async (
  accessToken?: string,
  refreshToken?: string
): Promise<AuthStatus> => {
  if (!accessToken) {
    if (refreshToken) {
      return { state: "needs-rotation", isVerified: false }
    }
    return UNAUTHENTICATED()
  }
  if (!refreshToken) {
    return {
      state: "needs-relogin",
      isVerified: false,
    }
  }
  const result = await validateAccessToken(accessToken)

  if (!result.ok) {
    return { state: "needs-rotation", isVerified: false }
  }
  const payload = result.data

  if (payload.acr !== "authenticated" && payload.acr !== "2fa-pending") {
    return UNAUTHENTICATED()
  }
  return {
    state: payload.acr,
    isVerified: payload.isVerified,
  }
}
