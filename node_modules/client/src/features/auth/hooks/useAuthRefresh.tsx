import type { ApiResult } from "@api/Response"
import useAuthContext from "./useAuthContext"
import { AuthService } from "../services"
import { useCallback, useRef } from "react"
import type { AuthResponseDto } from "@project/shared"

const useAuthRefresh = () => {
  const { track, setUser } = useAuthContext()

  const isRefreshing = useRef(false)
  const refreshPromiseRef = useRef<Promise<ApiResult<AuthResponseDto>> | null>(
    null,
  )
  const authRefresh = useCallback(() => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current
    }
    isRefreshing.current = true

    const refreshPromise = track<ApiResult<AuthResponseDto>>(
      AuthService.refresh()
        .then((result) => {
          if (result.ok) {
            setUser(result.data.user)
          } else {
            setUser(null)
          }
          return result
        })
        .finally(() => {
          isRefreshing.current = false
          refreshPromiseRef.current = null
        }),
    )
    refreshPromiseRef.current = refreshPromise
    return refreshPromise
  }, [track, setUser])

  return {
    authRefresh,
    isRefreshing: isRefreshing.current,
    promise: refreshPromiseRef.current,
  }
}
export default useAuthRefresh
