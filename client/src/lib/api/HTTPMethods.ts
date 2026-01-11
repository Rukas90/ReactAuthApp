import axios, { type AxiosRequestConfig } from "axios"
import { MAKE_REQUEST } from "./Requests"
import type { ApiResult } from "./Response"
import Cookies from "js-cookie"

export const HTTP = {
  GET<T>(
    api: string,
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResult<T>> {
    return MAKE_REQUEST(
      axios.get<T>(buildApiUrl(api, url), SETUP_CONFIG(config)),
      url
    )
  },
  POST<T>(
    api: string,
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResult<T>> {
    return MAKE_REQUEST(
      axios.post<T>(buildApiUrl(api, url), data, SETUP_CONFIG(config)),
      url
    )
  },
  PUT<T>(
    api: string,
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResult<T>> {
    return MAKE_REQUEST(
      axios.put<T>(buildApiUrl(api, url), data, SETUP_CONFIG(config)),
      url
    )
  },
  DELETE<T>(
    api: string,
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResult<T>> {
    return MAKE_REQUEST(
      axios.delete<T>(buildApiUrl(api, url), SETUP_CONFIG(config)),
      url
    )
  },
  PATCH<T>(
    api: string,
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResult<T>> {
    return MAKE_REQUEST(
      axios.patch<T>(buildApiUrl(api, url), data, SETUP_CONFIG(config)),
      url
    )
  },
}

export const SETUP_CONFIG = (
  config: AxiosRequestConfig = {}
): AxiosRequestConfig => {
  const csrfCookie = Cookies.get("csrf-token")
  const headers = {
    "Content-Type": "application/json",
    ...(csrfCookie ? { "X-CSRF-TOKEN": csrfCookie } : {}),
    ...config.headers,
  }
  return {
    ...config,
    withCredentials: true,
    timeout: config.timeout ?? 5000,
    headers,
  }
}

const buildApiUrl = (api: string, url: string): string => {
  const path = url.startsWith("/") ? url : `/${url}`

  if (!api) {
    console.error("api url is not defined")
    return path
  }
  return `${api}${path}`
}
