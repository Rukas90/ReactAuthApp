import { useMutation } from "@tanstack/react-query"
import UserService from "../services/UserService"
import {
  RETRY_AFTER_MS_FIELD_NAME,
  UserErrorCodes,
  Result,
} from "@project/shared"

type SendEmailResult = {
  [RETRY_AFTER_MS_FIELD_NAME]: number
}
const useSendEmailVerification = (
  onCallback?: (res: Result<SendEmailResult, SendEmailResult>) => void,
) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await UserService.sendEmailVerification()
      if (!res.ok) {
        const retryAfterMs =
          res.error.code === UserErrorCodes.USER_EMAIL_VERIFICATION_COOLDOWN
            ? ((res.error.extensions?.[RETRY_AFTER_MS_FIELD_NAME] as number) ??
              0)
            : 0

        return onCallback?.(Result.error({ retryAfterMs }))
      }
      return onCallback?.(Result.success(res.data))
    },
    retry: false,
  })
  return {
    send: mutation.mutate,
    sendAsync: mutation.mutateAsync,
    isSendLoading: mutation.status === "pending",
    error: mutation.error,
  }
}
export default useSendEmailVerification
