import { useQuery } from "@tanstack/react-query"
import UserService from "../services/UserService"

const useUserSessions = () => {
  const query = useQuery({
    queryKey: ["user", "sessions"],
    queryFn: async () => {
      const res = await UserService.getSessions()
      if (!res.ok) {
        throw res.error
      }
      return res.data
    },
  })
  return {
    ...query,
    sessions: query.data,
  }
}
export default useUserSessions
