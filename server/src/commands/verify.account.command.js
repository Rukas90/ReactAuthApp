import { verifyUserAccount } from "#controllers/user.controller.js"

const COMMAND_NAME = 'VERIFY_ACCOUNT'

export const VerifyAccountDispatch = {
    command: COMMAND_NAME,
    payload: null
}
export const VerifyAccountCommand = [COMMAND_NAME, async (context) => {
    return await verifyUserAccount(context.req)
}]