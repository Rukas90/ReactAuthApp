import type { ApiResult } from "@api/Response"
import useAuthContext from "./useAuthContext"
import type { LoginData } from "../schemas"
import { AuthService } from "../services"
import type { AuthResponseDto } from "@project/shared"

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
      }),
    )
  return handle
}
export default useLogin
