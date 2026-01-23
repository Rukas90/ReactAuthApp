import {
  configureEnrollment,
  deleteEnrollment,
  getMfaEnrollments,
} from "../service/mfa.service"
import { UnexpectedError } from "@shared/errors"
import { authRoute, AuthRequest } from "@shared/util"
import { getTotpData, verifyTotpCode } from "../service/totp.service"
import { getUserById } from "@base/feature/user"
import { MfaMethod, Result } from "@project/shared"
import { User } from "@prisma/client"

export const getUserConfiguredEnrollments = authRoute(
  async (req: AuthRequest, res) => {
    const enrollments = await getMfaEnrollments(req.session.auth.userId)
    res.ok(enrollments.filter((e) => e.configured).map((e) => e.method))
  },
)

export const initializeTotpData = authRoute(async (req, res, next) => {
  Result.tap(
    await initializeMethodData(req.session.auth.userId, getTotpData),
    (r) => res.ok(r),
    (e) => next(e),
  )
})
export const initializeMethodData = async <TData>(
  userId: string,
  getData: (user: User) => Promise<Result<TData, Error>>,
): Promise<Result<TData, Error>> => {
  const user = await getUserById(userId)

  if (!user.ok) {
    return Result.error(
      new UnexpectedError("Failed to get enrollment data.", "UNEXPECTED_ERROR"),
    )
  }
  return await getData(user.data)
}

export const deleteMfaEnrollment = authRoute(async (req, res) => {
  const method = req.params.method as MfaMethod
  const result = await deleteEnrollment(req.session.auth.userId, method)

  if (result.count > 0) {
    return res.ok("Enrollment was deleted successfully!")
  }
  res.ok("No enrollment was found. No enrollment of type was deleted.")
})

export const confirmTotp = authRoute(async (req, res, next) => {
  const userId = req.session.auth.userId
  const code = req.body.code

  const verification = await verifyTotpCode(userId, code)

  if (!verification.ok) {
    return next(verification.error)
  }
  await configureEnrollment(userId, "totp")
  res.ok("Verification was successfull!")
})
