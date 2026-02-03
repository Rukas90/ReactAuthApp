import { database } from "@base/app"
import {
  Device,
  OAuthProvider,
  Result,
  SessionDetails,
  SessionLocation,
  UserAgent,
  UserProfile,
  VoidResult,
} from "@project/shared"
import { Prisma, User, UserSession } from "@prisma/client"
import {
  UserEmailVerificationCooldownError,
  UserFailedToDeleteError,
  UserNotFoundError,
} from "../error/user.error"
import { hashing } from "@shared/security"
import { sessionService } from "@features/session"
import { refreshService } from "@shared/token"
import { AuthUnauthenticatedError } from "@features/auth"
import { UAParser } from "ua-parser-js"
import { UserInclude } from "prisma/generated/models/User"
import VerifyEmailDispatch from "../dispatch/verify-email.dispatch"
import { establishVerification, VerificationJob } from "@features/verification"
import ms from "ms"

const userService = {
  constants: {
    RETRY_EMAIL_VERIFY_TIMEOUT_DELAY: ms("5m"),
  },
  getUserByEmail: async <T extends UserInclude | undefined>(
    email: string,
    include?: T,
  ): Promise<
    Result<Prisma.UserGetPayload<{ include: T }>, UserNotFoundError>
  > => {
    const user = await database.client.user.findUnique({
      where: { email },
      include,
    })
    return user
      ? Result.success(user as Prisma.UserGetPayload<{ include: T }>)
      : Result.error(new UserNotFoundError())
  },
  getUserById: async <T extends UserInclude | undefined>(
    id: string,
    include?: T,
  ): Promise<
    Result<Prisma.UserGetPayload<{ include: T }>, UserNotFoundError>
  > => {
    const user = await database.client.user.findUnique({
      where: { id },
      include,
    })
    return user
      ? Result.success(user as Prisma.UserGetPayload<{ include: T }>)
      : Result.error(new UserNotFoundError())
  },
  getUserProfile: async (
    id: string,
  ): Promise<Result<UserProfile, UserNotFoundError>> => {
    const user = await userService.getUserById(id, {
      oauths: { select: { provider: true, username: true } },
    })
    if (!user.ok) {
      return user
    }
    return Result.success({
      email: user.data.email,
      verifiedEmail: user.data.is_verified,
      hasPassword: user.data.password_hash !== null,
      signInMethods: user.data.oauths.map((a) => {
        return {
          provider: a.provider as OAuthProvider,
          username: a.username ?? "",
        }
      }),
    })
  },
  createNewUser: async (email: string, isVerified: boolean): Promise<User> => {
    return await database.client.user.create({
      data: {
        email,
        is_verified: isVerified,
      },
    })
  },
  verifyUser: async (userId: string): Promise<User> => {
    return database.client.user.update({
      where: {
        id: userId,
      },
      data: {
        is_verified: true,
      },
    })
  },
  setPassword: async (userId: string, password: string) => {
    return database.client.user.update({
      where: {
        id: userId,
      },
      data: {
        password_hash: await hashing.argon2.hash(password),
      },
    })
  },
  getUserSessions: async (
    userId: string,
    refreshToken: string,
  ): Promise<Result<SessionDetails[], AuthUnauthenticatedError>> => {
    const sessions: UserSession[] = await sessionService.getSessions(userId)
    const currentToken = await refreshService.findRefreshToken(refreshToken)

    if (!currentToken.ok) {
      return Result.error(new AuthUnauthenticatedError())
    }
    const activeSessions = sessions.filter(
      (s) => sessionService.getSessionStatus(s) === "active",
    )
    const staleSessions = sessions
      .filter((s) => sessionService.getSessionStatus(s) !== "active")
      .slice(0, 2)

    return Result.success(
      [...activeSessions, ...staleSessions].map(
        (session) =>
          ({
            id: session.id,
            status: sessionService.getSessionStatus(session),
            isCurrent: session.family_id === currentToken.data.family_id,
            user_agent: parseUserAgent(session.user_agent),
            ip_address: session.ip_address,
            location: parseLocation(session.location, session.ip_address),
            created_at: session.created_at,
            last_accessed_at: session.last_accessed_at,
          }) satisfies SessionDetails,
      ),
    )
  },
  deleteUser: async (
    userId: string,
  ): Promise<VoidResult<UserFailedToDeleteError>> => {
    try {
      await database.client.user.delete({
        where: {
          id: userId,
        },
      })
      return VoidResult.ok()
    } catch {
      return VoidResult.error(new UserFailedToDeleteError())
    }
  },
  sendEmailVerification: async (userId: string) => {
    const user = await userService.getUserById(userId, { verifications: true })

    if (!user.ok) {
      return VoidResult.error(user.error)
    }
    const latest = user.data.verifications
      .filter((v) => v.dispatch_type === VerifyEmailDispatch.DISPATCH_NAME)
      .reduce<
        (typeof user.data.verifications)[number] | null
      >((a, b) => (!a || b.created_at > a.created_at ? b : a), null)

    if (latest) {
      const retryAt =
        latest.created_at.getTime() +
        userService.constants.RETRY_EMAIL_VERIFY_TIMEOUT_DELAY

      if (retryAt > Date.now()) {
        return VoidResult.error(
          new UserEmailVerificationCooldownError(retryAt - Date.now()),
        )
      }
    }
    await userService.createEmailVerifyVerification(
      user.data.id,
      user.data.email,
    )
    return VoidResult.ok()
  },
  createEmailVerifyVerification: async (userId: string, email: string) => {
    const job: VerificationJob<VerifyEmailDispatch> = {
      data: {
        userId,
        expiresMs: ms("10m"),
        dispatchName: VerifyEmailDispatch.DISPATCH_NAME,
        dispatchPayload: undefined,
        mailOptions: {
          recipient: email,
          subject: "Verify your account email",
        },
      },
      type: "token",
    }
    await establishVerification(job)
  },
}

const parseUserAgent = (userAgentString: string): UserAgent => {
  const parser = new UAParser(userAgentString)
  const result = parser.getResult()

  return {
    browser: result.browser.name || "Unknown Browser",
    browserVersion: result.browser.version,
    os: result.os.name || "Unknown OS",
    osVersion: result.os.version,
    device: result.device.type
      ? ((result.device.type.charAt(0).toUpperCase() +
          result.device.type.slice(1)) as Device)
      : "Desktop",
  }
}
const parseLocation = (
  locationString: string | null,
  ipAddress: string,
): SessionLocation | "localhost" | null => {
  if (isLocalhost(ipAddress)) {
    return "localhost"
  }
  if (!locationString) {
    return null
  }
  try {
    const parts = locationString.split(",").map((p) => p.trim())

    if (parts.length >= 2) {
      return {
        city: parts[0],
        region: parts.length > 2 ? parts[1] : undefined,
        country: parts[parts.length - 1],
      }
    }
    return null
  } catch {
    return null
  }
}
const isLocalhost = (ipAddress: string) => {
  return (
    ipAddress === "127.0.0.1" ||
    ipAddress === "::1" ||
    ipAddress.startsWith("localhost")
  )
}

export default userService
