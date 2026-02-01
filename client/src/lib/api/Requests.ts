import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios"
import { type ApiResult } from "./Response"
import { axiosErrorToProblemDetails, isSuccessResponse } from "./RequestHelpers"
import Cookies from "js-cookie"
import superjson from "superjson"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@project/shared"

export const API_URL = import.meta.env.VITE_API_URL

export const axiosBaseConfig = {
  baseURL: API_URL,
  timeout: 50000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: [
    (data) => {
      if (typeof data === "string") {
        try {
          const prased = superjson.parse(data)
          if (prased === undefined) {
            return JSON.parse(data)
          }
          return prased
        } catch (error) {
          try {
            return JSON.parse(data)
          } catch (jsonError) {
            return data
          }
        }
      }
      return data
    },
  ],
} satisfies AxiosRequestConfig

export const axiosInstance: AxiosInstance = axios.create(axiosBaseConfig)

axiosInstance.interceptors.request.use(async (request) => {
  const csrfCookie = Cookies.get(CSRF_COOKIE_NAME)
  if (!!csrfCookie) {
    request.headers[CSRF_HEADER_NAME] = csrfCookie
  }
  return request
})

export const makeRequest = async <T>(
  request: Promise<AxiosResponse<any>>,
  path: string,
): Promise<ApiResult<T>> => {
  try {
    const response = await request

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
