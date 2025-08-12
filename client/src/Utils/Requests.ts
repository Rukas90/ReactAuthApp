import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios"
import { API_URL } from "../Data/Variables"
import { Response } from "./Response"

axios.defaults.withCredentials = true

export const BuildApiUrl = (url: string): string => {
    const path = url.startsWith('/') ? url : `/${url}`
    
    if (!API_URL) {
        console.error('API_URL is not defined');
        return path // Return the path as-is if API_URL is not defined
    }
    return `${API_URL}${path}`
}

const DefaultConfiguration = {
    withCredentials: true,
    timeout: 5000
}

export const GET = async <T = any>(url: string, _?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.get<T>(BuildApiUrl(url), config)
    } catch (error) {
        return GetError<T>(error as Error)
    }
}

export const POST = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {  
    try {
        return await axios.post<T>(BuildApiUrl(url), data, config)
    } catch (error) {
        return GetError<T>(error as Error)
    }
}

export const PUT = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.put<T>(BuildApiUrl(url), data, config)
    } catch (error) {
        return GetError<T>(error as Error)
    }
}

export const DELETE = async <T = any>(url: string, _?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.delete<T>(BuildApiUrl(url), config)
    } catch (error) {
        return GetError<T>(error as Error)
    }
}

export const PATCH = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.patch<T>(BuildApiUrl(url), data, config)
    } catch (error) {
        return GetError<T>(error as Error)
    } 
}

export const MAKE_REQUEST = async (
    func: (url: string, data: any, config: AxiosRequestConfig) => Promise<AxiosResponse<any>>,
    path: string,
    data: any = {},
    config: AxiosRequestConfig = DefaultConfiguration
    
): Promise<Response> => {
    const headersConfig = {
        headers: {
            ...config.headers
        }
    }
    const fullConfig = { ...config, ...headersConfig }
    let response;
    try {
        response = await func(path, data, fullConfig)
        const success = response.status === 200
        return success ? {
            success: true,
            data:    response.data
        } : {
            success: false,
            error:   success ? undefined : response.data.error,
            status:  response.status
        }
    } catch (error) {
        return {
            success: false,
            error:   response ? response.data.error : (error as Error).message,
            status:  response ? response.status : 500
        };
    }
}

const GetError = <T = any>(error: Error) : AxiosResponse<T> => {
    
    const axiosError = error as AxiosError<T, any>

    if (axiosError && axiosError.response) {
        return axiosError.response
    }
    throw error
}