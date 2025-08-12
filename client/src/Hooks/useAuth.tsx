import { useEffect, useState } from "react"
import { AuthContextState, AuthState } from "Types/authTypes"
import { GetAuthStatus } from "Utils/Auth"

export const useAuth = (): AuthContextState => {
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState<AuthState | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await GetAuthStatus()
        if (response.success) {
          setState(response.data)
        } else {
          setState(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setState(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return {
    isLoading,
    state,
  }
}
