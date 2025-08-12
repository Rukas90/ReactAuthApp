import { DELETE, GET, PATCH, POST, MAKE_REQUEST } from "./Requests"
import { Response } from "./Response"
import { v4 as uuidv4 } from "uuid"
import { CacheLocation, SetValue } from "./Cache"
import { SessionAuthTokenKey } from "./Utilities"

interface AuthProps {
    email: string,
    password: string
    hcaptchaToken: string
}

/**
 * Register
 * Registers a new user with the provided email and password.
 * On successful registration, automatically attempts to log in the user.
 *
 * @param {AuthProps} AuthProps - Email and password for registration.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Register = async ({ email, password, hcaptchaToken }: AuthProps) : Promise<Response> => {

    const authData = {
        email,
        password,
        hcaptchaToken
    }
    return await MAKE_REQUEST(POST, '/auth/register', authData)
}
/**
 * Login
 * Logs in a user with the provided email and password.
 *
 * @param {AuthProps} AuthProps - Email and password for login.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Login = async ({ email, password, hcaptchaToken }: AuthProps) : Promise<Response> => {
    const authToken = await InitializeAuthToken()
  
    if (!authToken) {
        throw "Unable to initialize auth token"
    }
    const authData = {
        email,
        password,
        hcaptchaToken
    }
    return await MAKE_REQUEST(POST, '/auth/login', authData, { headers: { 'auth-token': authToken } })
}

export const InitializeAuthToken = async () : Promise<string | null> => {

    const authToken = uuidv4()
    const location = await SetValue({
        key: SessionAuthTokenKey,
        value: authToken, 
        life: 60000,
        singleUse: true,
        encode: true,
        password: authToken
    })
    if (location === CacheLocation.Nowhere) {
        return null
    }
    return authToken
}

/**
 * Logout
 * Logs out the current user.
 *
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Logout = async () : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/logout')
}
/**
 * Get2FAState
 * Retrieves the current two-factor authentication (2FA) state for the user.
 *
 * @returns {Promise<Response>} The response object with 2FA state data.
*/
export const Get2FAState = async () : Promise<Response> => {

    return await MAKE_REQUEST(GET, '/auth/2fa/status')
}
/**
 * Get2FAInitializeData
 * Retrieves initialization data for setting up 2FA for the user.
 *
 * @returns {Promise<Response>} The response object with 2FA initialization data.
*/
export const Get2FAInitializeData = async () : Promise<Response> => {

    return await MAKE_REQUEST(GET, '/auth/2fa/data')
}

export const IdentifyAccount = async (email: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/oauth/identify', { email: email })
}

export const SendVerificationCode = async (key: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/verify/send-code', { key: key })
}
export const CheckVerificationCode = async (key: string, code: string) : Promise<Response> => {
    
    return await MAKE_REQUEST(POST, '/verify/check-code', { key: key, code: code })
}
export const CancelVerification = async (key: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/verify/cancel', { key: key })
}

/**
 * Verify2FA
 * Verifies the provided 2FA code entered by the user.
 *
 * @param {string} code - 2FA code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Verify2FACode = async (code: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/2fa/verify', { code: code })
}
/**
 * Auth2FA
 * Verifies the code and handles two-step authentication.
 *
 * @param {string} code - 2FA code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Auth2FACode = async (code: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/2fa', { code: code })
}

export const GetAuthStatus = async () : Promise<Response> => {

    return await MAKE_REQUEST(GET, '/auth/status')
}

/**
 * Deactivate2FA
 * Deactivates two-factor authentication for the current user.
 *
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Deactivate2FA = async () : Promise<Response> => {

    return await MAKE_REQUEST(DELETE, '/auth/2fa')
}