import { DELETE, GET, POST } from "./Requests"
import { Response } from "./Response"

interface AuthProps {
    email: string,
    password: string
    token: string
}

/**
 * Register
 * Registers a new user with the provided email and password.
 * On successful registration, automatically attempts to log in the user.
 *
 * @param {AuthProps} AuthProps - Email and password for registration.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Register = async ({ email, password, token }: AuthProps) : Promise<Response> => {
    const authData = {
        email: email,
        password: password,
    }
    let response = await POST('/auth/register', authData, {
        headers: {
            'csrf-token': token
        }
    })
    if (response.status !== 200) {
        return {
            success: false,
            error: "Failed to register user!",
            data: response.data,
            status: response.status
        }
    }
    const loginProps = { email: email, password: password, token: token }
    return await Login(loginProps)
}
/**
 * Login
 * Logs in a user with the provided email and password.
 *
 * @param {AuthProps} AuthProps - Email and password for login.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Login = async ({ email, password, token }: AuthProps) : Promise<Response> => {
    const authData = {
        email: email,
        password: password,
    }
    const response = await POST('/auth/login', authData, {
        headers: {
            'csrf-token': token
        }
    })
    const success  = response.status === 200

    return {
        success: success,
        error: success ? undefined : "Failed to login user!",
        data: response.data,
        status: response.status
    }
}

/**
 * Verify
 * Verifies a user with a provided verification code.
 *
 * @param {string} code - Verification code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Verify = async (code : string, token: string) : Promise<Response> => {
    const response = await POST('/auth/verify', {
        code: code
    }, {
        headers: {
            'csrf-token': token
        }
    })
    const success = response.status === 200

    return {
        success: success,
        error: success ? undefined : "Failed to verify user!",
        data: response.data,
        status: response.status
    }
}
/**
 * Logout
 * Logs out the current user.
 *
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Logout = async (token: string) : Promise<Response> => {
    const response = await POST('/auth/logout', {}, {
        headers: {
            'csrf-token': token
        }
    })
    const success = response.status === 200

    return {
        success: success,
        error: success ? undefined : "Failed to logout user!",
        data: response.data,
        status: response.status
    }
}
/**
 * Get2FAState
 * Retrieves the current two-factor authentication (2FA) state for the user.
 *
 * @returns {Promise<Response>} The response object with 2FA state data.
*/
export const Get2FAState = async () : Promise<Response> => {
    const response = await GET('/auth/2fa/status')

    const success = response.status === 200
    const state = response.data.error ? false : response.data.state

    return {
        success: success,
        error: success ? undefined : response.data.error,
        data: state,
        status: response.status
    }
}
/**
 * Get2FAInitializeData
 * Retrieves initialization data for setting up 2FA for the user.
 *
 * @returns {Promise<Response>} The response object with 2FA initialization data.
*/
export const Get2FAInitializeData = async () : Promise<Response> => {
    const response = await GET('/auth/2fa')
    const success = response.status === 200

    return {
        success: success,
        error: success ? undefined : response.data.error,
        data: {
            qr_code:   response.data.qr_link,
            entry_key: response.data.entry_key
        },
        status: response.status
    }
}
/**
 * Verify2FA
 * Verifies the provided 2FA code entered by the user.
 *
 * @param {string} code - 2FA code.
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Verify2FA = async (code: string, token: string) : Promise<Response> => {
    const response = await POST('/auth/2fa', {
        code: code
    }, {
        headers: {
            'csrf-token': token
        }
    })
    const success = response.status === 200

    return {
        success: success,
        error: success ? undefined : "Failed to verify user!",
        data: response.data,
        status: response.status
    }
}
/**
 * Deactivate2FA
 * Deactivates two-factor authentication for the current user.
 *
 * @returns {Promise<Response>} The response object indicating success or failure.
*/
export const Deactivate2FA = async (token: string) : Promise<Response> => {
    const response = await DELETE('/auth/2fa', {
        headers: {
            'csrf-token': token
        }
    })
    const success = response.status === 200

    return {
        success: success,
        error: success ? undefined : "Failed to deactivate 2FA!",
        data: response.data,
        status: response.status
    }
}

export const GetCSRFToken = async () : Promise<Response> => {
    const response = await GET('/session/token')
    const success = response.status === 200

    return {
        success: success,
        error: success ? undefined : "Failed to get a CSRF token!",
        data: response.data.csrfToken,
        status: response.status
    }
}