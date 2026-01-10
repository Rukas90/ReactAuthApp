import { AuthService } from "#services/api/AuthService"
import type { ApiResult } from "#services/api/Response"
import { useAuthContext } from "../contexts/AuthContext"
import type { LogoutResponseDto } from "../dto/AuthResponse"

export const useLogout = () => {
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
