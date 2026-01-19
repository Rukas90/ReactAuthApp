import { getMfaEnrollments } from "../service/mfa.service"
import { MfaMethod } from "@prisma/client"
import { UnexpectedError } from "@shared/errors"
import { authRoute, AuthRequest } from "@shared/util"
import { getTotpData } from "../service/totp.service"
import { getUserById } from "@base/feature/user"

export const getUserConfiguredEnrollments = authRoute(
  async (req: AuthRequest, res) => {
    const enrollments = await getMfaEnrollments(req.session.auth.userId)
    res.ok(enrollments.filter((e) => e.configured).map((e) => e.method))
  },
)
export const initializeTotpData = authRoute(async (req, res, next) => {
  const session = req.session.auth
})
export const getInitEnrollmentData = authRoute(
  async (req: AuthRequest, res, next) => {
    const method = req.params.method as MfaMethod
    const user = await getUserById(req.session.auth.userId)

    if (!user.ok) {
      return next(
        new UnexpectedError(
          "Failed to get enrollment data.",
          "UNEXPECTED_ERROR",
        ),
      )
    }
    switch (method) {
      case "TOTP":
        return res.ok(getTotpData(user.data))
      default:
        return next(
          new UnexpectedError(
            "Failed to get enrollment data.",
            "UNEXPECTED_ERROR",
          ),
        )
    }
  },
)
