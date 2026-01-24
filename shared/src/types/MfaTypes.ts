export const MfaMethodCollection = ["totp"] as const
export type MfaMethod = (typeof MfaMethodCollection)[number]

export type MfaEnrollmentInfo = {
  method: MfaMethod
  configured: boolean
}
