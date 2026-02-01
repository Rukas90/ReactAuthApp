import { NextFunction, Response } from "express"
import userService from "../service/user.service"
import { AuthRequest, authRoute } from "@shared/util"
import {
  PasswordSetSchema,
  PasswordUpdateSchema,
  Result,
  SendEmailVerifyResponseDto,
} from "@project/shared"
import { ValidationError } from "@shared/errors"
import {
  authService,
  AuthInvalidSessionError,
  clearAuthTokenCookies,
  loginService,
  REFRESH_TOKEN_NAME,
} from "@features/auth"
import z from "zod"
import { generateCsrfCookie } from "@features/csrf"
import { sessionService } from "@features/session"
import { refreshService } from "@shared/token"
import {
  UserRevokeForeignSessionError,
  UserSessionCannotRevokeCurrentError,
} from "../error/user.error"

export const getUserProfileHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session.auth.userId
    const profile = await userService.getUserProfile(userId)

    Result.tap(
      profile,
      (data) => res.ok(data),
      (error) => next(error),
    )
  },
)
export const updateUserPasswordHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session.auth.userId
    const user = await userService.getUserById(userId)

    if (!user.ok) {
      return next(user.error)
    }
    const hasPassword = !!user.data.password_hash
    const schema = hasPassword ? PasswordUpdateSchema : PasswordSetSchema
    const validation = await schema.safeParseAsync(req.body)

    if (!validation.success) {
      const error = validation.error.issues[0]
      return next(new ValidationError(error.message, error.code))
    }
    const data = validation.data

    if (hasPassword) {
      const updateData = data as z.infer<typeof PasswordUpdateSchema>

      const validation = await loginService.validatePassword(
        updateData.currentPassword,
        user.data.password_hash!,
      )
      if (!validation.ok) {
        return next(validation.error)
      }
    }
    await userService.setPassword(userId, data.password)

    generateCsrfCookie(res)
    res.ok("Password updated successfully.")
  },
)
export const getUserSessionsHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session.auth.userId
    const refreshToken = req.cookies?.[REFRESH_TOKEN_NAME]

    const sessions = await userService.getUserSessions(userId, refreshToken)

    if (!sessions.ok) {
      return next(sessions.error)
    }
    res.ok(sessions.data)
  },
)
export const deleteUserAccountHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session.auth.userId
    const deletion = await userService.deleteUser(userId)

    if (!deletion.ok) {
      return next(deletion.error)
    }
    clearAuthTokenCookies(res)
    res.ok("Account was deleted successfully.")
  },
)
export const sendEmailVerificationHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session.auth.userId
    const verification = await userService.sendEmailVerification(userId)

    if (!verification.ok) {
      return next(verification.error)
    }
    const dto: SendEmailVerifyResponseDto = {
      retryAfterMs: userService.constants.RETRY_EMAIL_VERIFY_TIMEOUT_DELAY,
      message: "Verification email has been sent.",
    }
    res.ok(dto)
  },
)
export const revokeUserSessionHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session.auth.userId
    const sessionId = req.params.sessionId as string
    const session = await sessionService.getSessionById(sessionId)

    if (!session.ok) {
      return next(session.error)
    }
    if (session.data.user_id !== userId) {
      return next(new UserRevokeForeignSessionError())
    }
    const refreshTokenCookie = req.cookies?.[REFRESH_TOKEN_NAME]

    if (!refreshTokenCookie) {
      return next(new AuthInvalidSessionError())
    }
    const refreshToken =
      await refreshService.findRefreshToken(refreshTokenCookie)

    if (!refreshToken.ok) {
      return next(refreshToken.error)
    }
    if (refreshToken.data.family_id === session.data.family_id) {
      return next(new UserSessionCannotRevokeCurrentError())
    }
    await authService.revokeSessionFamily(session.data.family_id)
    res.ok("Session revoked successfully.")
  },
)
