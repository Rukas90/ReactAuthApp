import type { AxiosError } from "axios"
import type { ProblemDetails, SuccessResponse } from "./Response"

export const isSuccessResponse = <T>(data: any): data is SuccessResponse<T> => {
  return data && data.status === "success" && "data" in data
}
export const isProblemDetails = (data: any): data is ProblemDetails => {
  return (
    data &&
    typeof data.type === "string" &&
    typeof data.title === "string" &&
    typeof data.status === "number" &&
    typeof data.detail === "string"
  )
}
export const axiosErrorToProblemDetails = (
  error: AxiosError
): ProblemDetails => {
  if (error.response?.data && isProblemDetails(error.response.data)) {
    return error.response.data
  }
  return {
    type: "about:blank",
    title: error.response?.statusText || "Request Failed",
    status: error.response?.status || 500,
    detail: error.message || "An unexpected error occurred",
    code: error.code || "UNKNOWN_ERROR",
    instance: error.config?.url || "",
  }
}
