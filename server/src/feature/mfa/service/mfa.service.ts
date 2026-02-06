import { MfaEnrollment } from "@prisma/client"

type EnrollmentStatus =
  | "NULL"
  | "EXPIRED"
  | "INVALID"
  | "AWAITING_VERIFICATION"
  | "CONFIGURED"

const mfaService = {
  getEnrollmentStatus: (enrollment: MfaEnrollment | null): EnrollmentStatus => {
    if (!enrollment) {
      return "NULL"
    }
    if (enrollment.configured) {
      return "CONFIGURED"
    }
    if (!enrollment.expires_At) {
      return "INVALID"
    }
    if (new Date() > enrollment.expires_At) {
      return "EXPIRED"
    }
    return "AWAITING_VERIFICATION"
  },
}
export default mfaService
