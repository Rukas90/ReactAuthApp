import { type ApiResult, HTTP, API_URL } from "@lib/api"
import type { LoginData, RegisterData } from "@auth/schemas"
import type { AuthResponseDto, LogoutResponseDto } from "@auth/dto"
import type { SessionData } from "@auth/types"

const AuthService = {
  async login(data: LoginData): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>(API_URL, "/v1/auth/login", data)
  },

  async register(data: RegisterData): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>(API_URL, "/v1/auth/register", data)
  },

  async logout(): Promise<ApiResult<LogoutResponseDto>> {
    return HTTP.POST<LogoutResponseDto>(API_URL, "/v1/auth/logout")
  },

  async user(): Promise<ApiResult<SessionData>> {
    return HTTP.GET<SessionData>(API_URL, "/v1/auth/user")
  },

  async refresh(): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>(API_URL, "/v1/auth/refresh")
  },
}
export default AuthService
