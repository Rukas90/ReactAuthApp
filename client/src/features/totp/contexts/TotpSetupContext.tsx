import type { TotpData } from "@project/shared"
import type { ApiResult } from "@src/lib"
import { createContext } from "react"

export interface TotpSetupContextData {
  data: TotpData | null
  verifyCode: (code: string) => void
  cancelSetup: () => Promise<ApiResult<void>>
  error: string | null
  requiredCodeLength: number
}
export const TotpSetupContext = createContext<TotpSetupContextData | undefined>(
  undefined,
)
