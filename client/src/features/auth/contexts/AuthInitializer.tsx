import { createContext, useLayoutEffect, useRef } from "react"
import { useAuthContext } from "#features/auth/contexts/AuthContext"
import { useFetchUser } from "#features/auth/hooks/useFetchUser"

const AuthInitializerContext = createContext<null>(null)

export const AuthInitializer = ({ children }: React.ComponentProps<"div">) => {
  const fetchUser = useFetchUser()
  const { isInitialized } = useAuthContext()
  const init = useRef(false)

  useLayoutEffect(() => {
    if (isInitialized || init.current) {
      return
    }
    console.log("Initialize")
    init.current = true
    fetchUser()
  }, [])

  return (
    <AuthInitializerContext.Provider value={null}>
      {children}
    </AuthInitializerContext.Provider>
  )
}
