import type { LoginData } from "#auth/db/LoginSchema"
import type { RegisterData } from "#auth/db/RegisterSchema"
import type {
  AuthResponseDto,
  LogoutResponseDto,
} from "src/features/auth/dto/AuthResponse"
import type { AuthUser } from "#types/auth.types"
import { HTTP } from "./HTTPMethods"
import { API_URL } from "./Requests"
import type { ApiResult } from "./Response"

export const AuthService = {
  async login(data: LoginData): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>(API_URL, "/v1/auth/login", data)
  },

  async register(data: RegisterData): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>(API_URL, "/v1/auth/register", data)
  },

  async logout(): Promise<ApiResult<LogoutResponseDto>> {
    return HTTP.POST<LogoutResponseDto>(API_URL, "/v1/auth/logout")
  },

  async user(): Promise<ApiResult<AuthUser | null>> {
    return HTTP.GET<AuthUser | null>(API_URL, "/v1/auth/user")
  },
}
