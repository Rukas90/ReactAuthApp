import { getMfaEnrollments } from "../service/mfa.service"
import { MfaMethod } from "@prisma/client"
import { UnauthenticatedError, UnexpectedError } from "@shared/errors"
import { asyncRoute } from "@shared/util"
import { NextFunction, Request, Response } from "express"
import { getTotpData } from "../service/totp.service"
import { getUserById } from "@base/feature/user"

export const getUserConfiguredEnrollments = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session

    if (!session || !session.sub) {
      return next(new UnauthenticatedError())
    }
    const userId = session.sub
    const enrollments = await getMfaEnrollments(userId)

    res.ok(enrollments.filter((e) => e.configured).map((e) => e.method))
  }
)
export const getInitEnrollmentData = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session

    if (!session || !session.sub) {
      return next(new UnauthenticatedError())
    }
    const method = req.params.method as MfaMethod
    const user = await getUserById(session.sub)

    if (!user.ok) {
      return next(
        new UnexpectedError(
          "Failed to get enrollment data.",
          "UNEXPECTED_ERROR"
        )
      )
    }
    switch (method) {
      case "TOTP":
        return res.ok(getTotpData(user.data))
      default:
        return next(
          new UnexpectedError(
            "Failed to get enrollment data.",
            "UNEXPECTED_ERROR"
          )
        )
    }
  }
)
