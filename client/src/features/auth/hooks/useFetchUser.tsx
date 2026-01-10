import { AuthService } from "#services/api/AuthService"
import { useCallback } from "react"
import { useAuthContext } from "../contexts/AuthContext"

export const useFetchUser = () => {
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
