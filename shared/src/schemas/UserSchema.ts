import { z } from "zod"

export const EmailSchema = z.email({ error: "Invalid email address" })

const CurrentPasswordSchema = z
  .string({ error: "Current password is required" })
  .min(8, { error: "Current password is required" })

export const PasswordSchema = z
  .string({ error: "Password value is not a valid string" })
  .min(8, {
    error: "Password cannot be less than 8 characters in length",
  })
  .regex(/[A-Z]/, {
    error: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    error: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, {
    error: "Password must contain at least one number",
  })
  .regex(/[^A-Za-z0-9]/, {
    error: "Password must contain at least one special character",
  })

const ConfirmPasswordSchema = z.string({
  error: "Please confirm your password",
})

export const PasswordSetSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const PasswordUpdateSchema = z
  .object({
    currentPassword: CurrentPasswordSchema,
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string({ error: "Password value is not a valid string" }).min(8, {
    error: "Password cannot be less than 8 characters in length",
  }),
  captchaToken: z.string().optional(),
})
export const RegisterSchema = PasswordSetSchema.extend({
  email: EmailSchema,
  captchaToken: z.string().optional(),
})

export type LoginData = z.infer<typeof LoginSchema>
export type RegisterData = z.infer<typeof RegisterSchema>
