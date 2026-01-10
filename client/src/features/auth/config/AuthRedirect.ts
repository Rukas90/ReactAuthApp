import type { AuthUser } from "#types/auth.types"

export const getDefaultRedirect = (user: AuthUser | null) => {
  if (!user) {
    return "/login"
  }
  if (user.otpPending) {
    return "otpVerify"
  }
  return "/dashboard"
}
