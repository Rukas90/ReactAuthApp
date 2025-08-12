import Spinner from "Components/UI/Spinner"
import { useAuth } from "Hooks/useAuth"
import React, { createContext, useContext } from "react"
import { AuthContextState } from "Types/authTypes"

const AuthContext = createContext<AuthContextState>(null!)

export const useAuthContext = () => useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth()

  if (auth.isLoading) {
    return <Spinner />
  }
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
