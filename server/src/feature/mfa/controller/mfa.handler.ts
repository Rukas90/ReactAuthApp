import mfaService from "../service/mfa.service"
import { DomainError } from "@shared/errors"
import { authRoute, AuthRequest } from "@shared/util"
import totpService from "../service/totp.service"
import { userService } from "@features/user"
import { MfaMethod, MfaEnrollmentInfo, Result } from "@project/shared"
import { User } from "@prisma/client"
import { MfaEnrollmentFetchFailedError } from "../error/mfa.error"
import {
  authService,
  clearAuthTokenCookies,
  setAuthSessionCookies,
} from "@features/auth"
import { extractSessionContext } from "@base/feature/session"
import { generateCsrfCookie } from "@features/csrf"

export const getUserEnrollments = authRoute(async (req: AuthRequest, res) => {
  const enrollments = await mfaService.getMfaEnrollments(
    req.session.auth.userId,
  )
  const infos: MfaEnrollmentInfo[] = enrollments.map((e) => ({
    method: e.method as MfaMethod,
    configured: e.configured,
  }))
  res.ok(infos)
})

export const initializeTotpData = authRoute(async (req, res, next) => {
  Result.tap(
    await initializeMethodData(
      req.session.auth.userId,
      totpService.getTotpData,
    ),
    (r) => res.ok(r),
    (e) => next(e),
  )
})
export const initializeMethodData = async <TData>(
  userId: string,
  getData: (user: User) => Promise<Result<TData, DomainError>>,
): Promise<Result<TData, DomainError>> => {
  const user = await userService.getUserById(userId)

  if (!user.ok) {
    return Result.error(new MfaEnrollmentFetchFailedError())
  }
  return await getData(user.data)
}

export const deleteMfaEnrollment = authRoute(async (req, res) => {
  const method = req.params.method as MfaMethod
  const result = await mfaService.deleteEnrollment(
    req.session.auth.userId,
    method,
  )

  if (result.count > 0) {
    return res.ok("Enrollment was deleted successfully!")
  }
  res.ok("No enrollment was found. No enrollment of type was deleted.")
})

export const confirmTotp = authRoute(async (req, res, next) => {
  const userId = req.session.auth.userId
  const code = req.body.code

  const verification = await totpService.verifyTotpCode(userId, code)

  if (!verification.ok) {
    return next(verification.error)
  }
  await mfaService.configureEnrollment(userId, "totp")
  res.ok("Verification was successfull!")
})

export const loginTotp = authRoute(async (req, res, next) => {
  const userId = req.session.auth.userId
  const code = req.body.code

  const verification = await totpService.verifyTotpCode(userId, code)

  if (!verification.ok) {
    return next(verification.error)
  }
  const user = await userService.getUserById(userId)

  if (!user.ok) {
    return next(user.error)
  }
  clearAuthTokenCookies(res)

  const { accessToken, refreshToken, authUser } =
    await authService.createUserAuthSession(
      user.data,
      extractSessionContext(req),
    )

  setAuthSessionCookies(res, accessToken, refreshToken, authUser)
  generateCsrfCookie(res)

  res.auth({
    user: authUser,
    message: "Logged in successfully.",
  })
})
