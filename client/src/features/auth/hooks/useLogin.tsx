import { AuthService } from "#services/api/AuthService"
import type { ApiResult } from "#services/api/Response"
import { useAuthContext } from "../contexts/AuthContext"
import type { LoginData } from "../db/LoginSchema"
import type { AuthResponseDto } from "../dto/AuthResponse"

export const useLogin = () => {
  const { track, setUser } = useAuthContext()

  const handle = (data: LoginData) =>
    track<ApiResult<AuthResponseDto>>(
      AuthService.login(data).then((result) => {
        if (result.ok) {
          setUser(result.data.user)
        } else {
          setUser(null)
        }
        return result
      })
    )
  return handle
}
