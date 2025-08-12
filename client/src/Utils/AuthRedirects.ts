import { AuthContextState, AuthMode, AuthRequirement, ROUTE_CONFIG } from "Types/authTypes"

export const GetRequiredRedirect = (
  currentPath: string,
  auth: AuthContextState
): string | null => {
  const routeConfig = ROUTE_CONFIG[currentPath as keyof typeof ROUTE_CONFIG]
  const requirement = routeConfig?.auth ?? AuthRequirement.NONE

  if (requirement === AuthRequirement.NONE) {
    return null
  }
  const state = auth.state

  console.log(state)

  if (!state) {
    return requirement === AuthRequirement.GUEST_ONLY ? null : '/login'
  }
  if (state.isAuthenticated && state.isVerified && state.mode === AuthMode.FullyAuthenticated) {
    return '/'
  }
  if (requirement === AuthRequirement.GUEST_ONLY) {

    if (state.isAuthenticated) {

      if (state.mode === AuthMode.AwaitingManualIdentification) {
        return '/oauth-identify'
      }
      if (!state.isVerified) {
        return '/verify-account'
      }
      if (state.mode === AuthMode.Requires2FA) {
        return '/verify-2fa'
      }
      return '/'
    }
    return null
  }
  if (!state.isAuthenticated) {
      return '/login'
  }
  if (state.mode === AuthMode.AwaitingManualIdentification && currentPath !== '/oauth-identify') {
    return '/oauth-identify'
  }
  if (state.mode === AuthMode.Requires2FA && currentPath !== '/verify-2fa') {
    return '/verify-2fa'
  }
  if (!state.isVerified && currentPath !== '/verify-account') {
    return '/verify-account'
  }
  else if (state.isVerified && currentPath !== '/verify-account') {
    return '/'
  }
  if (state.mode === AuthMode.FullyAuthenticated && currentPath !== '/') {
    return '/'
  }
  if (requirement === AuthRequirement.COMPLETE) {
    if (state.mode !== AuthMode.FullyAuthenticated) {

      if (state.mode === AuthMode.AwaitingManualIdentification) {
        return '/oauth-identify'
      }
      if (!state.isVerified) {
        return '/verify-account'
      }
      if (state.mode === AuthMode.Requires2FA) {
        return '/verify-2fa'
      }

    }
  }
  return null
}