import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utils/Variables"

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
const useAuthCheck = (redirectPath = "/login") => {
  const [isLoading, setLoading] = useState(true) // Indicates if the auth check is in progress
  const navigate = useNavigate()

  useEffect(() => {
    // Function to check auth status and handle redirection
    axios
      .get(`${API_URL}/auth/status`)
      .then((res) => {
        if (!res.data.authenticated) {
          navigate(redirectPath) // Redirect if not authenticated
        }
      })
      .catch((error) => {
        console.error("Error checking auth status: ", error)
        navigate(redirectPath) // Redirect on error
      })
      .finally(() => {
        setLoading(false) // Set loading to false once done
      })
  }, [navigate, redirectPath])

  return isLoading // Return the loading state
}

export default useAuthCheck
