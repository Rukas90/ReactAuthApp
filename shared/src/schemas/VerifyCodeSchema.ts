import { z } from "zod"

export const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
})
export type VerifyCode = z.infer<typeof verifyCodeSchema>
