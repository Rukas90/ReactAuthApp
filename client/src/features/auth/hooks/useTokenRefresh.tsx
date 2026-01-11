import { useEffect } from "react"
import useAuthContext from "./useAuthContext"
import useFetchUser from "./useFetchUser"

const useTokenRefresh = (refreshThresholdMs: number = 3 * 60 * 1000) => {
  const { user, isInitialized } = useAuthContext()
  const fetchUser = useFetchUser()

  useEffect(() => {
    if (!user || !isInitialized) {
      return
    }
    const timeUntilExpiry = user.accessExpires - Date.now()

    if (timeUntilExpiry <= refreshThresholdMs) {
      fetchUser()
      return
    }
    const timerId = setTimeout(() => {
      fetchUser()
    }, timeUntilExpiry - refreshThresholdMs)

    return () => clearTimeout(timerId)
  }, [user?.accessExpires, isInitialized, fetchUser, refreshThresholdMs])
}
export default useTokenRefresh
