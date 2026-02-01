import type { ApiResult } from "@api/Response"
import useAuthContext from "./useAuthContext"
import { AuthService } from "../services"
import type { AuthResponseDto, RegisterData } from "@project/shared"

const useRegister = () => {
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
      }),
    )
  return handle
}
export default useRegister
