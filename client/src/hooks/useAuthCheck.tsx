import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utils/Variables"

enum AuthState {
  Authenticated,
  NotVerified,
  NotLoggedIn,
}

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
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    status: AuthState.NotLoggedIn,
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Function to check auth status and handle redirection
    axios
      .get(`${API_URL}/auth/status`, { withCredentials: true })
      .then((res) => {
        const newStatus = res.data.isVerified
          ? AuthState.Authenticated
          : AuthState.NotVerified

        setAuthStatus({
          isLoading: false,
          status: newStatus,
        })
        if (!res.data.authenticated || newStatus !== AuthState.Authenticated) {
          navigate(res.data.authenticated ? "/verify" : "/login")
        }
      })
      .catch((error) => {
        console.error("Error checking auth status: ", error)

        setAuthStatus({
          isLoading: false,
          status: AuthState.NotLoggedIn,
        })
        navigate("/login") // Redirect on error
      })
  }, [navigate])

  return authStatus // Return the loading state
}

export default useAuthCheck
