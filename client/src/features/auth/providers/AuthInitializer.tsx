import { AuthInitializerContext } from "@auth/contexts"
import { useAuthContext, useAuthRefresh } from "@auth/hooks"
import { useRef, useLayoutEffect } from "react"
import { AuthService } from "../services"

const AuthInitializer = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  const { isInitialized, setUser, track } = useAuthContext()
  const authRefresh = useAuthRefresh()

  const init = useRef(false)

  useLayoutEffect(() => {
    if (isInitialized || init.current) {
      return
    }
    init.current = true

    track(
      AuthService.user()
        .then(async (result) => {
          if (!result.ok) {
            setUser(null)
            return
          }
          const session = result.data

          setUser(session.user)

          if (!session.user && session.canRefresh) {
            const refresh = await authRefresh()

            if (refresh.ok) {
              setUser(refresh.data.user)
            }
          }
        })
        .catch(() => setUser(null))
    )
  }, [])

  return (
    <AuthInitializerContext.Provider value={null}>
      {children}
    </AuthInitializerContext.Provider>
  )
}
export default AuthInitializer
