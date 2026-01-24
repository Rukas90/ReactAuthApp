import { type AuthUser } from "@project/shared"

export const getDefaultRedirect = (user: AuthUser | null) => {
  if (!user) {
    return "/login"
  }
  if (user.scope.includes("mfa:verify")) {
    return "/session/mfa"
  }
  return "/dashboard"
}
