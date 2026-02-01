import type { ApiResult } from "@api/Response"
import useAuthContext from "./useAuthContext"
import { AuthService } from "../services"

const useLogout = () => {
  const { track, setUser } = useAuthContext()

  const handle = () =>
    track<ApiResult<string>>(
      AuthService.logout().then((result) => {
        if (result.ok) {
          setUser(null)
        }
        return result
      }),
    )
  return handle
}
export default useLogout
