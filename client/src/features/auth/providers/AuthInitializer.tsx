import { AuthInitializerContext } from "@auth/contexts"
import { useFetchUser, useAuthContext } from "@auth/hooks"
import { useRef, useLayoutEffect } from "react"

const AuthInitializer = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
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
export default AuthInitializer
