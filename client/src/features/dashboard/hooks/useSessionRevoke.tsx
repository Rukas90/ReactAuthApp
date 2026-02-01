import { useMutation, useQueryClient } from "@tanstack/react-query"
import UserService from "../services/UserService"

const useSessionRevoke = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["session", "revoke"],
    mutationFn: async (sessionId: string) => {
      const res = await UserService.revokeSession(sessionId)
      if (!res.ok) {
        throw res.error
      }
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "sessions"] })
    },
    retry: false,
  })
  return {
    revoke: mutation.mutate,
    revokeAsync: mutation.mutateAsync,
    isRevoking: mutation.isPending,
  }
}
export default useSessionRevoke
