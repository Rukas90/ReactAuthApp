import z from "zod"

export const RegisterSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string({ message: "Password value is not a valid string" })
      .min(8, {
        message: "Password cannot be less than 8 characters in length",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string({ message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type RegisterData =
  | z.infer<typeof RegisterSchema>
  | {
      captchaToken: string
    }
