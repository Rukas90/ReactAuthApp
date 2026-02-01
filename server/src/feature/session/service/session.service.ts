import { database } from "@base/app"
import { UserSession } from "@prisma/client"
import { Result, SessionStatus } from "@project/shared"
import { SessionNotFoundError } from "../error/session.error"
import { UserSessionWhereUniqueInput } from "prisma/generated/models"

export type SessionContext = {
  userAgent: string
  ipAddress: string
  location?: string
}

const sessionService = {
  createSession: async (
    familyId: string,
    userId: string,
    context: SessionContext | undefined | null,
    expiresAt: Date,
  ): Promise<UserSession> => {
    return await database.client.userSession.create({
      data: {
        family_id: familyId,
        user_id: userId,
        user_agent: context?.userAgent ?? "",
        ip_address: context?.ipAddress ?? "",
        location: context?.location,
        expires_at: expiresAt,
      },
    })
  },
  getSessionById: async (
    sessionId: string,
  ): Promise<Result<UserSession, SessionNotFoundError>> => {
    const session = await database.client.userSession.findUnique({
      where: {
        id: sessionId,
      },
    })
    return !!session
      ? Result.success(session)
      : Result.error(new SessionNotFoundError())
  },
  getSession: async (
    where: UserSessionWhereUniqueInput,
  ): Promise<Result<UserSession, SessionNotFoundError>> => {
    const session = await database.client.userSession.findUnique({
      where,
    })
    return !!session
      ? Result.success(session)
      : Result.error(new SessionNotFoundError())
  },
  getSessions: async (userId: string) => {
    return await database.client.userSession.findMany({
      where: {
        user_id: userId,
      },
      orderBy: { last_accessed_at: "desc" },
    })
  },
  refreshSession: async (familyId: string, userId: string, expiresAt: Date) => {
    return await database.client.userSession.update({
      where: {
        family_id: familyId,
        user_id: userId,
      },
      data: {
        last_accessed_at: new Date(),
        expires_at: expiresAt,
      },
    })
  },
  revokeSession: async (familyId: string) => {
    return await database.client.userSession.update({
      where: {
        family_id: familyId,
      },
      data: {
        revoked: true,
      },
    })
  },
  getSessionStatus: (session: UserSession): SessionStatus => {
    if (session.revoked) {
      return "revoked"
    }
    if (session.expires_at <= new Date()) {
      return "expired"
    }
    return "active"
  },
}

export default sessionService
