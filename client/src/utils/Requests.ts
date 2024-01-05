import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { API_URL } from "./Variables"

const U = (url: string): string => {
    return `${API_URL}${url}`
}

const DefaultConfiguration = {
    withCredentials: true
}

export const GET = async <T = any>(url: string, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.get<T>(U(url), config)
    } catch (error) {
        throw error
    }
}

export const POST = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.post<T>(U(url), data, config)
    } catch (error) {
        throw error
    }
}

export const PUT = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.put<T>(U(url), data, config)
    } catch (error) {
        throw error
    }
}

export const DELETE = async <T = any>(url: string, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.delete<T>(U(url), config)
    } catch (error) {
        throw error
    }
}

export const PATCH = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = DefaultConfiguration): Promise<AxiosResponse<T>> => {
    try {
        return await axios.patch<T>(U(url), data, config)
    } catch (error) {
        throw error
    }
}