export type SessionData = {
  user: AuthUser
  canRefresh: boolean
}
export type AuthUser = {
  verifiedEmail: boolean
  otpPending: boolean
  expiresAt: number
}
