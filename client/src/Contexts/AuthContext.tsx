import type { LoginData } from "#schemas/LoginSchema"
import type { RegisterData } from "#schemas/RegisterSchema"
import type { ReactChildrenProps } from "#types/ui.types"
import { createContext, useContext, useState } from "react"
import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from "#requests/AuthRequests"

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
    const result = await loginRequest(data)
    console.log(result)
    return result
  }
  const register = async (data: RegisterData) => {
    const result = await registerRequest(data)
    console.log(result)
    return result
  }
  const signOut = async () => {
    const result = await logoutRequest()
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
