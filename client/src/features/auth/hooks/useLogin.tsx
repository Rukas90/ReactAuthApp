import type { LoginData } from "@auth/db"
import type { AuthResponseDto } from "@auth/dto"
import { AuthService } from "@auth/services"
import type { ApiResult } from "src/lib/api/Response"
import useAuthContext from "./useAuthContext"

const useLogin = () => {
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
export default useLogin
