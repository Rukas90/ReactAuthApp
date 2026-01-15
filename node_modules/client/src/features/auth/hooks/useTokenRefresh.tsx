import { useCallback, useEffect, useState } from "react"
import useAuthContext from "./useAuthContext"
import useAuthRefresh from "./useAuthRefresh"

const useTokenRefresh = (refreshThresholdMs: number = 3 * 60 * 1000) => {
  const { user, isInitialized } = useAuthContext()
  const [refreshing, setRefreshing] = useState(false)
  const authRefresh = useAuthRefresh()

  useEffect(() => {
    if (!user || !isInitialized) {
      return
    }
    const timeUntilExpiry = user.expiresAt - Date.now()

    if (timeUntilExpiry <= refreshThresholdMs) {
      handleRefresh()
      return
    }
    const timerId = setTimeout(() => {
      handleRefresh()
    }, timeUntilExpiry - refreshThresholdMs)

    return () => clearTimeout(timerId)
  }, [user, isInitialized, authRefresh, refreshThresholdMs])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await authRefresh()
    } finally {
      setRefreshing(false)
    }
  }, [authRefresh])

  return {
    refreshing,
  }
}
export default useTokenRefresh
