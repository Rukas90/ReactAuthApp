import { AuthService } from "@auth/services"
import { useCallback } from "react"
import useAuthContext from "./useAuthContext"

const useFetchUser = () => {
  const { track, setUser } = useAuthContext()

  return useCallback(
    () =>
      track(
        AuthService.user().then((result) => {
          if (result.ok) {
            setUser(result.data)
          } else {
            setUser(null)
          }
        })
      ),
    [track, setUser]
  )
}
export default useFetchUser
