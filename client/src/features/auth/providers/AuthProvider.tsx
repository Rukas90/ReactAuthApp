import { useState, useCallback } from "react"
import type { AuthUser } from "@auth/types"
import { AuthContext } from "@auth/contexts"

const AuthProvider = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [user, setUserInternal] = useState<AuthUser | null>(null)
  const [isInitialized, setInitialized] = useState(false)

  const isTokenExpired = useCallback((): boolean => {
    if (!user) {
      return true
    }
    return Date.now() >= user.accessExpires
  }, [user])

  const track = useCallback(async <T,>(func: Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      return await func
    } finally {
      setLoading(false)
    }
  }, [])

  const setUser = useCallback((user: AuthUser | null) => {
    setUserInternal(user)
    setInitialized(true)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isInitialized,
        user,
        setUser,
        track,
        isTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider
