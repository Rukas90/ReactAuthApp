import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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

  useEffect(() => {
    const validate = async () => {
      try {
        setAuthorized(false)
        setIsLoading(true)

        const response = await GetAuthStatus()

        if (!response.success) {
          navigate("/login")

          console.error("Auth check error:", response.error)
          return
        }
        const authStatus = response.data

        if (authStatus.authState === 1) {
          navigate("/oauth-identify")
          return
        }
        if (!authStatus.authenticated) {
          navigate("/login")
          return
        }
        if (!authStatus.isVerified) {
          navigate("/verify")
          return
        }
        if (authStatus === 2) {
          navigate("/verify-2fa")
          return
        }
        setAuthorized(true)
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
