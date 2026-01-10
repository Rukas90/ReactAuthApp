export type TokenPair = {
  accessToken: string
  refreshToken: string
}
export type AuthUser = {
  isVerified: boolean
  otpPending: boolean
  accessExpires: number
}
