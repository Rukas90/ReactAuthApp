import { useCallback, useEffect, useLayoutEffect } from "react"
import useAuthContext from "./useAuthContext"
import useAuthRefresh from "./useAuthRefresh"
import { axiosInstance } from "@src/lib"
import { useNavigate } from "react-router-dom"
import { AuthErrorCodes } from "@project/shared"
import { useQueryClient } from "@tanstack/react-query"

const useTokenRefresh = (refreshThresholdMs: number = 3 * 60 * 1000) => {
  const queryClient = useQueryClient()
  const { user, isInitialized } = useAuthContext()
  const { authRefresh, isRefreshing } = useAuthRefresh()
  const navigate = useNavigate()

  const hasFullAccess = (!!user && user.scope.includes("admin:access")) ?? false

  const handleRefresh = useCallback(async () => {
    const response = await authRefresh()
    if (!response.ok) {
      navigate("/login")
    } else {
      queryClient.invalidateQueries({ queryKey: ["user", "sessions"] })
    }
    return response
  }, [authRefresh])

  useLayoutEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (originalRequest._retry) {
          return Promise.reject(error)
        }
        if (error.response.data.status === 401) {
          if (
            error.response.data.code !== AuthErrorCodes.AUTH_UNAUTHENTICATED
          ) {
            return Promise.reject(error)
          }
          const refresh = await handleRefresh()

          if (refresh.ok) {
            originalRequest._retry = true
            await new Promise((r) => setTimeout(r, 10))
            return await axiosInstance(originalRequest)
          }
        }
        return Promise.reject(error)
      },
    )
    return () => {
      axiosInstance.interceptors.response.eject(interceptorId)
    }
  }, [handleRefresh])

  useEffect(() => {
    if (!hasFullAccess || !isInitialized) {
      return
    }
    const timeUntilExpiry = user!.expiresAt - Date.now()

    if (timeUntilExpiry <= refreshThresholdMs && !isRefreshing) {
      setTimeout(handleRefresh, 0)
      return
    }
    const timerId = setTimeout(() => {
      handleRefresh()
    }, timeUntilExpiry - refreshThresholdMs)

    return () => clearTimeout(timerId)
  }, [user, isInitialized, handleRefresh, refreshThresholdMs])
}
export default useTokenRefresh
