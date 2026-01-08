import type { LoginData } from "#auth/db/LoginSchema"
import type { RegisterData } from "#auth/db/RegisterSchema"
import type { LoginResponseDto } from "#features/auth/dto/LoginResponse"
import type { RegisterResponseDto } from "#features/auth/dto/RegisterResponse"
import type { AuthStatus } from "#types/auth.types"
import { HTTP } from "./HTTPMethods"
import { API_URL } from "./Requests"
import type { ApiResult } from "./Response"

export const AuthService = {
  async login(data: LoginData): Promise<ApiResult<LoginResponseDto>> {
    return HTTP.POST<LoginResponseDto>(API_URL, "/v1/auth/login", data)
  },

  async register(data: RegisterData): Promise<ApiResult<RegisterResponseDto>> {
    return HTTP.POST<RegisterResponseDto>(API_URL, "/v1/auth/register", data)
  },

  async logout(): Promise<ApiResult<string>> {
    return HTTP.POST<string>(API_URL, "/v1/auth/logout")
  },

  async status(): Promise<ApiResult<AuthStatus>> {
    return HTTP.GET<AuthStatus>(API_URL, "/v1/auth/status")
  },
}
