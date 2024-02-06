import { Response } from "./Response"
import { POST, MAKE_REQUEST } from "./Requests"

export const SetUserPassword = async (password: string, csrfToken: string) : Promise<Response> => {
    return await MAKE_REQUEST(POST, '/user/password/update', csrfToken, { password: password })
}
export const ValidatePassword = async (password: string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/user/password/verify', csrfToken, { password: password })
}
export const DeleteAccount = async (csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/user/delete', csrfToken)
}