import type { TotpData } from "@project/shared"
import { API_URL, HTTP, type ApiResult } from "@src/lib"

export const getInitMfaEnrollmentData = () => {}

const MfaService = {
  Totp: {
    async getInitData(): Promise<ApiResult<TotpData>> {
      return HTTP.POST<TotpData>(
        API_URL,
        "/v1/auth/mfa/enrollments/:method/initialize",
        undefined,
        {
          params: {
            method: "TOTP",
          },
        }
      )
    },
  },
}
export default MfaService
