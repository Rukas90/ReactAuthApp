export enum AuthMode {
    None                         = 0,
    AwaitingManualIdentification = 1,
    Requires2FA                  = 2,
    FullyAuthenticated           = 3
}
export type User = {
  id: string
}
export interface AuthState {
  isAuthenticated: boolean
  isVerified:      boolean
  mode:            AuthMode
  user:            User
}
export interface AuthContextState {
  isLoading: boolean
  state: AuthState | null
}
export enum AuthRequirement {
  NONE          = 'none',     // Public routes. No authentication required
  GUEST_ONLY    = 'guest',    // Login, register - redirect if authenticated
  AUTHENTICATED = 'auth',     // Requires authentication
  VERIFIED      = 'verified', // Requires verification
  COMPLETE      = 'complete'  // Requires complete authentication
}
export const ROUTE_CONFIG = {
  '/404': { auth: AuthRequirement.NONE },
  '/': { auth: AuthRequirement.COMPLETE },

  '/login': { auth: AuthRequirement.GUEST_ONLY },
  '/register': { auth: AuthRequirement.GUEST_ONLY },

  '/verify-account': { auth: AuthRequirement.AUTHENTICATED },
  '/verify-2fa': { auth: AuthRequirement.AUTHENTICATED },
  '/oauth-identify': { auth: AuthRequirement.AUTHENTICATED },
} as const