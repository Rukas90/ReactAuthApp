import { DELETE, GET, PATCH, POST, MAKE_REQUEST } from "./Requests"
import { Response } from "./Response"
import { v4 as uuidv4 } from "uuid"
import { CacheLocation, SetValue } from "./Cache"
import { SessionAuthTokenKey } from "./Utilities"

interface AuthProps {
    email: string,
    password: string
    csrfToken: string
}

/**
 * Register
 * Registers a new user with the provided email and password.
 * On successful registration, automatically attempts to log in the user.
 *
 * @param {AuthProps} AuthProps - Email and password for registration.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Register = async ({ email, password, csrfToken }: AuthProps) : Promise<Response> => {

    const authData = {
        email: email,
        password: password,
    }
    const response = await MAKE_REQUEST(POST, '/auth/register', csrfToken, authData)
    
    if (!response.success) {
        return response
    }
    const loginProps = { email: email, password: password, csrfToken: csrfToken }
    return await Login(loginProps)
}
/**
 * Login
 * Logs in a user with the provided email and password.
 *
 * @param {AuthProps} AuthProps - Email and password for login.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Login = async ({ email, password, csrfToken }: AuthProps) : Promise<Response> => {
    const authToken = await InitializeAuthToken()
  
    if (!authToken) {
        throw "Unable to initialize auth token"
    }
    const authData = {
        email: email,
        password: password,
    }
    return await MAKE_REQUEST(POST, '/auth/login', csrfToken, authData, { headers: { 'auth-token': authToken } })
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
 * Verify
 * Verifies a user with a provided verification code.
 *
 * @param {string} code - Verification code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Verify = async (code : string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/verify', csrfToken, { code: code })
}
/**
 * Logout
 * Logs out the current user.
 *
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Logout = async (csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/logout', csrfToken)
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

export const IdentifyAccount = async (email: string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/oauth/identify', csrfToken, { email: email })
}

export const SendVerificationCode = async (key: string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/verify/send-code', csrfToken, { key: key })
}
export const CheckVerificationCode = async (key: string, code: string, csrfToken: string) : Promise<Response> => {
    
    return await MAKE_REQUEST(POST, '/verify/check-code', csrfToken, { key: key, code: code })
}
export const CancelVerification = async (key: string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/verify/cancel', csrfToken, { key: key })
}

/**
 * Verify2FA
 * Verifies the provided 2FA code entered by the user.
 *
 * @param {string} code - 2FA code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Verify2FACode = async (code: string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/2fa/verify', csrfToken, { code: code })
}
/**
 * Auth2FA
 * Verifies the code and handles two-step authentication.
 *
 * @param {string} code - 2FA code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Auth2FACode = async (code: string, csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(POST, '/auth/2fa', csrfToken, { code: code })
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
export const Deactivate2FA = async (csrfToken: string) : Promise<Response> => {

    return await MAKE_REQUEST(DELETE, '/auth/2fa', csrfToken)
}

export const GetCSRFToken = async () : Promise<Response> => {

    return await MAKE_REQUEST(GET, '/session/token')
}