import { type ApiResult, HTTP } from "@lib/api"
import type { OAuthProvider } from "@project/shared"

const OAuthService = {
  async disconnect(provider: OAuthProvider): Promise<ApiResult<string>> {
    return HTTP.POST<string>(`/v1/oauth/${provider}/disconnect`)
  },
}
export default OAuthService
