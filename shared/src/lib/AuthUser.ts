export type SessionData = {
  user: AuthUser | null
  canRefresh: boolean
}
export type Scope = "mfa:verify" | "admin:access"

export type AuthUser = {
  verifiedEmail: boolean
  scope: Scope[]
  expiresAt: number
}
