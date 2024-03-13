import Spinner from "Components/UI/Spinner"
import useAuthCheck from "Hooks/useAuthCheck"
import React, { createContext, useContext } from "react"

interface AuthContextState {
  isValidating: boolean
  authorized: boolean
}

const AuthContext = createContext<AuthContextState>({
  isValidating: false,
  authorized: false,
})

export const useAuthContext = () => useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthCheck()

  if (auth.isLoading) {
    return <Spinner />
  }
  return (
    <AuthContext.Provider
      value={{ isValidating: auth.isLoading, authorized: auth.authorized }}
    >
      {children}
    </AuthContext.Provider>
  )
}
