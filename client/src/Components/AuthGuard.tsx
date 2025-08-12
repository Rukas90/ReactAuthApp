import { useAuthContext } from "Contexts/AuthContext"
import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { GetRequiredRedirect } from "Utils/AuthRedirects"

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const redirectPath = GetRequiredRedirect(location.pathname, auth)

    if (redirectPath && redirectPath !== location.pathname) {
      navigate(redirectPath, { replace: true })
    }
  }, [auth, location.pathname, navigate])

  const redirectPath = GetRequiredRedirect(location.pathname, auth)

  if (redirectPath && redirectPath !== location.pathname) {
    return null
  }
  return <>{children}</>
}
