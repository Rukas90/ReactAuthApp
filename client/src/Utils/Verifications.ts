import { MAKE_REQUEST, POST } from "./Requests"
import { Response } from "./Response"

export type VerificationDispatch = {
    command: string,
    payload: { }
}
export type VerificationSettings = {
    type: string,
    dispatch: VerificationDispatch,
    validDurationInHours?: number,
    maxAttempts?: number
}
export type VerificationEmailSettings = {
    title: string,
    body?: string
}
export type VerificationTemplate = {
    
    settings: VerificationSettings
    email: VerificationEmailSettings
}
export type EstablishedVerification = {
    verificationId: string,
    message: string
}

export const EstablishVerification = async (template: VerificationTemplate, findByType: boolean) : Promise<Response<EstablishedVerification>> => {
    return await MAKE_REQUEST(POST, '/verifications', template, 
        findByType ? { params: { type: template.settings.type } } : { }
    )
}
export const VerifyCode = async (verificationID: string, code: string) : Promise<Response> => {
    return await MAKE_REQUEST(POST, '/verifications/verify', { verificationId: verificationID, code: code })
}