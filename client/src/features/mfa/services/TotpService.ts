import type { AuthResponseDto, TotpCode, TotpData } from "@project/shared"
import { HTTP, type ApiResult } from "@src/lib"

const TotpService = {
  async getInitData(): Promise<ApiResult<TotpData>> {
    return HTTP.POST<TotpData>("/v1/mfa/totp/initialize")
  },
  async confirmSetup(code: TotpCode): Promise<ApiResult<string>> {
    return HTTP.POST<string>("/v1/mfa/totp/confirm", code)
  },
  async login(code: TotpCode): Promise<ApiResult<AuthResponseDto>> {
    return HTTP.POST<AuthResponseDto>("/v1/mfa/totp/login", code)
  },
  async verifyCode(code: TotpCode): Promise<ApiResult<string>> {
    return HTTP.POST<string>("/v1/mfa/totp/verify", code)
  },
  async delete(): Promise<ApiResult<void>> {
    return HTTP.DELETE("/v1/mfa/totp")
  },
}
export default TotpService
