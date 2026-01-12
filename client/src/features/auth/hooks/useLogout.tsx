import type { LogoutResponseDto } from "@auth/dto"
import { AuthService } from "@auth/services"
import type { ApiResult } from "@api/Response"
import useAuthContext from "./useAuthContext"

const useLogout = () => {
  const { track, setUser } = useAuthContext()

  const handle = () =>
    track<ApiResult<LogoutResponseDto>>(
      AuthService.logout().then((result) => {
        if (result.ok) {
          setUser(null)
        }
        return result
      })
    )
  return handle
}
export default useLogout
