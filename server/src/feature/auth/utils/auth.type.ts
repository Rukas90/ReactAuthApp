export type TokenPair = {
  accessToken: string
  refreshToken: string
}
export type TokenAuthState = "2fa-pending" | "authenticated"
export type AuthState =
  | "unauthenticated"
  | TokenAuthState
  | "needs-relogin"
  | "needs-rotation"

export type AuthStatus = {
  state: AuthState
  isVerified: boolean
}
