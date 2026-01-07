import z from "zod"

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password value is not a valid string" })
    .min(8, { message: "Password cannot be less than 8 characters in length" }),
})
export type LoginData =
  | z.infer<typeof LoginSchema>
  | {
      captchaToken: string
    }
