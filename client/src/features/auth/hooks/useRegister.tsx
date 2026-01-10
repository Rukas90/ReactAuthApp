import type { RegisterData } from "@auth/schemas"
import type { AuthResponseDto } from "@auth/dto"
import { AuthService } from "@auth/services"
import type { ApiResult } from "src/lib/api/Response"
import useAuthContext from "./useAuthContext"

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
      })
    )
  return handle
}
export default useRegister
