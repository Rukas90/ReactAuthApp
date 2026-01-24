import { z } from "zod"

export const totpCodeSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
})
export type TotpCode = z.infer<typeof totpCodeSchema>
