export type SessionData = {
  user: AuthUser | null
  canRefresh: boolean
}
export type AuthLevel = "pre_2fa" | "full"

export type AuthUser = {
  verifiedEmail: boolean
  authLevel: AuthLevel
  expiresAt: number
}
