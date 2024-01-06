import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { API_URL } from "./Variables"

export const BuildApiUrl = (url: string): string => {
    const path = url.startsWith('/') ? url : `/${url}`

    if (!API_URL) {
        console.error('API_URL is not defined');
        return path // Return the path as-is if API_URL is not defined
    }
    return `${API_URL}${path}`
}

const DefaultConfiguration = {
    withCredentials: true
}

export const GET = async <T = any>(url: string, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.get<T>(BuildApiUrl(url), config)
    } catch (error) {
        throw error
    }
}

export const POST = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.post<T>(BuildApiUrl(url), data, config)
    } catch (error) {
        throw error
    }
}

export const PUT = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.put<T>(BuildApiUrl(url), data, config)
    } catch (error) {
        throw error
    }
}

export const DELETE = async <T = any>(url: string, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.delete<T>(BuildApiUrl(url), config)
    } catch (error) {
        throw error
    }
}

export const PATCH = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.patch<T>(BuildApiUrl(url), data, config)
    } catch (error) {
        throw error
    }
}