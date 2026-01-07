import type { LoginData } from "#auth/db/LoginSchema"
import type { RegisterData } from "#auth/db/RegisterSchema"
import type { ReactChildrenProps } from "#types/ui.types"
import { createContext, useContext, useState } from "react"
import { AuthService } from "#services/api/AuthService"

export type AuthState = {
  isAuthenticated: boolean
}
const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
}
const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: ReactChildrenProps) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<AuthState>(DEFAULT_AUTH_STATE)

  return <AuthContext value={state}>{children}</AuthContext>
}

export const useAuthContext = () => {
  const auth = useContext(AuthContext)

  if (auth === undefined) {
    throw new Error("useAuthContext must be used within a AuthContext")
  }
  const signIn = async (data: LoginData) => {
    const result = await AuthService.login(data)
    console.log(result)
    return result
  }
  const register = async (data: RegisterData) => {
    const result = await AuthService.register(data)
    console.log(result)
    return result
  }
  const signOut = async () => {
    const result = await AuthService.logout()
    console.log(result)
    return result
  }

  return {
    signIn,
    register,
    signOut,
    state: auth,
  }
}
