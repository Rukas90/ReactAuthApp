import { type ApiResult, axiosBaseConfig, HTTP } from "@lib/api"
import type {
  AuthResponseDto,
  LoginData,
  RegisterData,
  SessionData,
} from "@project/shared"
import axios, { type AxiosInstance } from "axios"

export const refreshInstance: AxiosInstance = axios.create(axiosBaseConfig)

const AuthService = {
  async login(data: LoginData): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>("/v1/auth/login", data)
  },

  async register(data: RegisterData): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>("/v1/auth/register", data)
  },

  async logout(): Promise<ApiResult<string>> {
    return HTTP.POST<string>("/v1/auth/logout")
  },

  async session(): Promise<ApiResult<SessionData>> {
    return HTTP.GET<SessionData>("/v1/auth/session")
  },

  async refresh(): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>(
      "/v1/auth/refresh",
      undefined,
      {
        validateStatus: (_) => true,
      },
      refreshInstance,
    )
  },
}
export default AuthService
