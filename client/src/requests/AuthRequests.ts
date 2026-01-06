import type { LoginData } from "#schemas/LoginSchema"
import type { RegisterData } from "#schemas/RegisterSchema"
import { POST } from "./HTTPMethods"
import { API_URL, MAKE_REQUEST } from "./Requests"
import type { ApiResult } from "./Response"

export const loginRequest = async (
  data: LoginData
): Promise<ApiResult<string>> => {
  return MAKE_REQUEST<string>(POST, API_URL, "/v1/auth/login", data)
}

export const registerRequest = async (
  data: RegisterData
): Promise<ApiResult<string>> => {
  return MAKE_REQUEST<string>(POST, API_URL, "/v1/auth/register", data)
}
export const logoutRequest = async () => {
  return MAKE_REQUEST<string>(POST, API_URL, "/v1/auth/logout")
}
