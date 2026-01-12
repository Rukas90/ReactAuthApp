export type TokenPair = {
  accessToken: string
  refreshToken: string
}
export type SessionData = {
  user: AuthUser | null
  canRefresh: boolean
}
export type AuthUser = {
  verifiedEmail: boolean
  otpPending: boolean
  expiresAt: number
}
