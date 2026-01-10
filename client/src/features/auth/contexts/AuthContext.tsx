import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react"
import { type AuthUser } from "#types/auth.types"

interface AuthContextData {
  isLoading: boolean
  isInitialized: boolean
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  track: <T>(func: Promise<T>) => Promise<T>
  isTokenExpired: () => boolean
}
const AuthContext = createContext<AuthContextData | undefined>(undefined)

export const AuthProvider = ({ children }: React.ComponentProps<"div">) => {
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

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
