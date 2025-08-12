import { Response } from "./Response"
import { POST, DELETE, MAKE_REQUEST } from "./Requests"

export const SetUserPassword = async (password: string) : Promise<Response> => {
    return await MAKE_REQUEST(POST, '/user/password/update', { password: password })
}
export const ValidatePassword = async (password: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/user/password/verify', { password: password })
}
export const DeleteAccount = async () : Promise<Response> => {

    return await MAKE_REQUEST(DELETE, '/user')
}