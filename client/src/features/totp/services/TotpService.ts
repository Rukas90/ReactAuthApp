import type { TotpData } from "@project/shared"
import { HTTP, type ApiResult } from "@src/lib"

const TotpService = {
  async getInitData(): Promise<ApiResult<TotpData>> {
    return HTTP.POST<TotpData>("/v1/auth/mfa/totp/initialize")
  },
  async verifyCode(code: string): Promise<ApiResult<TotpData>> {
    return HTTP.POST<TotpData>("/v1/auth/mfa/totp/verify", code)
  },
  async delete(): Promise<ApiResult<void>> {
    return HTTP.DELETE("/v1/auth/mfa/totp")
  },
}
export default TotpService
