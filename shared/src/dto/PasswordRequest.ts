export type PasswordSetRequest = {
  password: string
  confirmPassword: string
}
export const PasswordSetFieldNames = {
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
} as const satisfies Record<string, keyof PasswordSetRequest>

export type PasswordUpdateRequest = PasswordSetRequest & {
  currentPassword: string
}
