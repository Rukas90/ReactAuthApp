import type { AuthResponseDto } from "@auth/dto"
import { AuthService } from "@auth/services"
import type { ApiResult } from "src/lib/api/Response"
import useAuthContext from "./useAuthContext"

const useAuthRefresh = () => {
  const { track, setUser } = useAuthContext()

  const handle = () =>
    track<ApiResult<AuthResponseDto>>(
      AuthService.refresh().then((result) => {
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
export default useAuthRefresh
