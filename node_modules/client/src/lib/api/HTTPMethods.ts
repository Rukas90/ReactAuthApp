import { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { axiosInstance, makeRequest } from "./Requests"
import type { ApiResult } from "./Response"

export const HTTP = {
  GET<T>(
    url: string,
    config: AxiosRequestConfig = {},
    instance: AxiosInstance = axiosInstance,
  ): Promise<ApiResult<T>> {
    return makeRequest(instance.get<T>(url, config), url)
  },
  POST<T>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
    instance: AxiosInstance = axiosInstance,
  ): Promise<ApiResult<T>> {
    return makeRequest(instance.post<T>(url, data, config), url)
  },
  PUT<T>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
    instance: AxiosInstance = axiosInstance,
  ): Promise<ApiResult<T>> {
    return makeRequest(instance.put<T>(url, data, config), url)
  },
  DELETE<T>(
    url: string,
    config: AxiosRequestConfig = {},
    instance: AxiosInstance = axiosInstance,
  ): Promise<ApiResult<T>> {
    return makeRequest(instance.delete<T>(url, config), url)
  },
  PATCH<T>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
    instance: AxiosInstance = axiosInstance,
  ): Promise<ApiResult<T>> {
    return makeRequest(instance.patch<T>(url, data, config), url)
  },
}
