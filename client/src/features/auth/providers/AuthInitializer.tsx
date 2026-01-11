import { AuthInitializerContext } from "@auth/contexts"
import { useFetchUser, useAuthContext } from "@auth/hooks"
import { useRef, useLayoutEffect, useEffect } from "react"

const AuthInitializer = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  const fetchUser = useFetchUser()
  const { isInitialized, user } = useAuthContext()
  const init = useRef(false)
  const temp = useRef<number>(0)

  useLayoutEffect(() => {
    if (isInitialized || init.current) {
      return
    }
    init.current = true
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user || !isInitialized) {
      return
    }
    const timeUntilExpiry = user.accessExpires - Date.now()
    const refreshThreshold = 30 * 1000

    if (timeUntilExpiry <= refreshThreshold) {
      console.log("refresh")
      temp.current += 1
    }
    const timerId = setTimeout(() => {
      console.log("Refresh")
      temp.current += 1
    }, Math.max(0, timeUntilExpiry - refreshThreshold))

    return () => clearTimeout(timerId)
  }, [temp.current, user, isInitialized])

  return (
    <AuthInitializerContext.Provider value={null}>
      {children}
    </AuthInitializerContext.Provider>
  )
}
export default AuthInitializer
