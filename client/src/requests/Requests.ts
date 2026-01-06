import axios, {
  type AxiosResponse,
  type AxiosRequestConfig,
  AxiosError,
} from "axios"
import { type ApiResult } from "./Response"
import Cookies from "js-cookie"
import { axiosErrorToProblemDetails, isSuccessResponse } from "./RequestHelpers"

axios.defaults.withCredentials = true

export const API_URL = import.meta.env.VITE_API_URL

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

export const MAKE_REQUEST = async <T>(
  func: (
    api: string,
    url: string,
    data: any,
    config: AxiosRequestConfig
  ) => Promise<AxiosResponse<any>>,
  api: string,
  path: string,
  data: any = {},
  config: AxiosRequestConfig = {}
): Promise<ApiResult<T>> => {
  const fullConfig = SETUP_CONFIG(config)
  try {
    const response = await func(api, path, data, fullConfig)
    if (isSuccessResponse<T>(response.data)) {
      return {
        ok: true,
        data: response.data.data,
      }
    }
    return {
      ok: false,
      error: {
        type: "about:blank",
        title: "Invalid Response Format",
        status: response.status,
        detail: "Server returned success status but invalid response format",
        code: "INVALID_RESPONSE_FORMAT",
        instance: path,
      },
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        ok: false,
        error: axiosErrorToProblemDetails(error),
      }
    }
    return {
      ok: false,
      error: {
        type: "about:blank",
        title: "Unexpected Error",
        status: 500,
        detail:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        code: "UNEXPECTED_ERROR",
        instance: path,
      },
    }
  }
}
