import { AuthService } from "#services/api/AuthService"
import type { ApiResult } from "#services/api/Response"
import { useAuthContext } from "../contexts/AuthContext"
import type { RegisterData } from "../db/RegisterSchema"
import type { AuthResponseDto } from "../dto/AuthResponse"

export const useRegister = () => {
  const { track, setUser } = useAuthContext()

  const handle = (data: RegisterData) =>
    track<ApiResult<AuthResponseDto>>(
      AuthService.register(data).then((result) => {
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
