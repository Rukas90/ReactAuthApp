import { Dispatch, DispatchContext } from "@shared/dispatch"
import userService from "../service/user.service"

class VerifyEmailDispatch extends Dispatch<void> {
  static readonly DISPATCH_NAME = "verify_email" as const
  readonly name = VerifyEmailDispatch.DISPATCH_NAME

  async execute(context: DispatchContext): Promise<void> {
    await userService.verifyUser(context.userId)
  }
}
export default VerifyEmailDispatch
