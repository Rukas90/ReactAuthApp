import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { GetAuthStatus } from "Utils/Auth"

/**
 * useAuthCheck Hook
 *
 * Custom hook for checking authentication status and redirecting if not authenticated.
 *
 * Args:
 * - redirectPath (string): The path to redirect to if the user is not authenticated. Defaults to "/login".
 *
 * Behavior:
 * - On mount, sends a request to check the authentication status.
 * - If the user is not authenticated, redirects to the specified path.
 * - If an error occurs during the check, also redirects to the specified path.
 * - Provides a loading state to indicate the ongoing authentication check.
 *
 * Returns:
 * - isLoading (boolean): True if the authentication check is in progress, false otherwise.
 */
const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  /* AREA FOR IMPROVEMENT */
  const authRedirectSlugs = [
    "/login",
    "/register",
    "/oauth-identify",
    "/verify",
    "/verify-2fa",
  ]
  /* AREA FOR IMPROVEMENT */

  const redirect = (slug: string, additional?: string[]) => {
    if (
      location.pathname === slug ||
      (additional && additional.includes(location.pathname))
    ) {
      return
    }
    navigate(slug)
  }

  useEffect(() => {
    const validate = async () => {
      try {
        setAuthorized(false)
        setIsLoading(true)

        const response = await GetAuthStatus()

        if (!response.success) {
          redirect("/login", ["/register"])

          console.error("Auth check error:", response.error)
          return
        }
        const authStatus = response.data

        if (authStatus.authState === 1) {
          redirect("/oauth-identify")
          return
        }
        if (!authStatus.authenticated) {
          redirect("/login", ["/register"])
          return
        }
        if (!authStatus.isVerified) {
          redirect("/verify")
          return
        }
        if (authStatus.authState === 2) {
          redirect("/verify-2fa")
          return
        }
        setAuthorized(true)

        if (authRedirectSlugs.includes(location.pathname)) {
          redirect("/")
        }
      } catch (error) {
        throw error
      } finally {
        setIsLoading(false)
      }
    }
    validate()
  }, [navigate])

  return {
    isLoading: isLoading,
    authorized: authorized,
  }
}

export default useAuthCheck
