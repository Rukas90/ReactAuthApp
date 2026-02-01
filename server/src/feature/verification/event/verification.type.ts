import { Dispatch, DispatchPayload } from "@shared/dispatch"
import { VerificationData } from "../service/verification.service"

export type VerificationJob<TDispatch extends Dispatch> = {
  data: VerificationData<DispatchPayload<TDispatch>>
  type: "code" | "token"
}
