import type { AuthUser } from "@auth/types"

export const getDefaultRedirect = (user: AuthUser | null) => {
  if (!user) {
    return "/login"
  }
  if (user.otpPending) {
    return "session/2fa"
  }
  return "/dashboard"
}
