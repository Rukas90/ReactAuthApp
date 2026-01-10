import axios, { type AxiosResponse, AxiosError } from "axios"
import { type ApiResult } from "./Response"
import { axiosErrorToProblemDetails, isSuccessResponse } from "./RequestHelpers"

axios.defaults.withCredentials = true

export const API_URL = import.meta.env.VITE_API_URL

export const MAKE_REQUEST = async <T>(
  request: Promise<AxiosResponse<any>>,
  path: string
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
