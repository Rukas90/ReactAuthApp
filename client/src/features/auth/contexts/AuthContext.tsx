import type { AuthUser } from "@auth/types"
import { createContext } from "react"

export interface AuthContextData {
  isLoading: boolean
  isInitialized: boolean
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  track: <T>(func: Promise<T>) => Promise<T>
  isTokenExpired: () => boolean
}
export const AuthContext = createContext<AuthContextData | undefined>(undefined)
