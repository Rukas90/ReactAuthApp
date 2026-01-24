import {
  configureEnrollment,
  deleteEnrollment,
  getMfaEnrollments,
} from "../service/mfa.service"
import { DomainError } from "@shared/errors"
import { authRoute, AuthRequest } from "@shared/util"
import { getTotpData, verifyTotpCode } from "../service/totp.service"
import { getUserById } from "@features/user"
import { MfaMethod, MfaEnrollmentInfo, Result } from "@project/shared"
import { User } from "@prisma/client"
import { MfaEnrollmentFetchFailedError } from "../error/mfa.error"
import { setAuthSessionCookies } from "@base/feature/auth/util/auth.response"
import { generateFullAccessToken, generateRefreshToken } from "@shared/token"
import { clearAuthTokenCookies } from "@base/feature/auth/util/auth.cookie"

export const getUserEnrollments = authRoute(async (req: AuthRequest, res) => {
  const enrollments = await getMfaEnrollments(req.session.auth.userId)
  const infos: MfaEnrollmentInfo[] = enrollments.map((e) => ({
    method: e.method as MfaMethod,
    configured: e.configured,
  }))
  res.ok(infos)
})

export const initializeTotpData = authRoute(async (req, res, next) => {
  Result.tap(
    await initializeMethodData(req.session.auth.userId, getTotpData),
    (r) => res.ok(r),
    (e) => next(e),
  )
})
export const initializeMethodData = async <TData>(
  userId: string,
  getData: (user: User) => Promise<Result<TData, DomainError>>,
): Promise<Result<TData, DomainError>> => {
  const user = await getUserById(userId)

  if (!user.ok) {
    return Result.error(new MfaEnrollmentFetchFailedError())
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

export const loginTotp = authRoute(async (req, res, next) => {
  const userId = req.session.auth.userId
  const code = req.body.code

  const verification = await verifyTotpCode(userId, code)

  if (!verification.ok) {
    return next(verification.error)
  }
  const user = await getUserById(userId)

  if (!user.ok) {
    return next(user.error)
  }
  const { accessToken, authUser } = await generateFullAccessToken(user.data)
  const refreshToken = await generateRefreshToken(user.data)

  clearAuthTokenCookies(res)
  setAuthSessionCookies(res, accessToken, refreshToken, authUser)

  res.auth({
    user: authUser,
    message: "Registered and logged in successfully.",
  })
})
