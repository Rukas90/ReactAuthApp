import type { LoginData } from "#auth/db/LoginSchema"
import type { RegisterData } from "#auth/db/RegisterSchema"
import { POST } from "./HTTPMethods"
import { API_URL, MAKE_REQUEST } from "./Requests"
import type { ApiResult } from "./Response"

export const AuthService = {
  async login(data: LoginData): Promise<ApiResult<string>> {
    return MAKE_REQUEST<string>(POST, API_URL, "/v1/auth/login", data)
  },

  async register(data: RegisterData): Promise<ApiResult<string>> {
    return MAKE_REQUEST<string>(POST, API_URL, "/v1/auth/register", data)
  },

  async logout(): Promise<ApiResult<string>> {
    return MAKE_REQUEST<string>(POST, API_URL, "/v1/auth/logout")
  },
}
