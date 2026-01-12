import { useState, useCallback } from "react"
import type { AuthUser } from "@auth/types"
import { AuthContext } from "@auth/contexts"

const AuthProvider = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [user, setUserInternal] = useState<AuthUser | null>(null)
  const [isInitialized, setInitialized] = useState(false)

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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider
