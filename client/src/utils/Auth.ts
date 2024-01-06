import { POST } from "./Requests"

interface Response<T = any> {
    success?: boolean
    error?: string
    data?: T
    status?: number
}

interface AuthProps {
    email: string,
    password: string
}
export const Register = async ({ email, password }: AuthProps) : Promise<Response> => {
    const authData = {
        email: email,
        password: password,
    }
    let response = await POST('/auth/register', authData)

    if (response.status !== 200) {
        return {
            success: false,
            error: "Failed to register user!",
            data: response.data,
            status: response.status
        }
    }
    return await Login(authData)
}
export const Login = async ({ email, password }: AuthProps) : Promise<Response> => {
    const authData = {
        email: email,
        password: password,
    }
    const response = await POST('/auth/login', authData)
    const success  = response.status === 200

    return {
        success: success,
        error: success ? '' : "Failed to register user!",
        data: response.data,
        status: response.status
    }
}
export const AuthGoogle = async () : Promise<Response> => {
    const response = await POST('/auth/google')
    const success  = response.status === 200
    
    return {
        success: success,
        error: success ? '' : "Failed to authenticate user!",
        data: response.data,
        status: response.status
    }
}
export const Verify = async (code : string) : Promise<Response> => {
    const response = await POST('/auth/verify', {
        code: code
    })
    const success = response.status === 200

    return {
        success: success,
        error: success ? '' : "Failed to verify user!",
        data: response.data,
        status: response.status
    }
}
export const Logout = async () : Promise<Response> => {
    const response = await POST('/auth/logout')
    const success = response.status === 200

    return {
        success: success,
        error: success ? '' : "Failed to logout user!",
        data: response.data,
        status: response.status
    }
}