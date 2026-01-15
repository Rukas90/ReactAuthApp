import { database } from "@base/app"
import {
  RefreshTokenError,
  RefreshTokenExpiredError,
  RefreshTokenInvalidError,
  RefreshTokenReusedError,
  ResourceMissingError,
} from "@shared/errors"
import { Result } from "@project/shared"
import { hashing } from "@shared/security"
import { RefreshToken, User } from "@prisma/client"
import crypto from "crypto"

export const generateRefreshToken = async (
  user: User,
  familyId: string = crypto.randomUUID()
): Promise<string> => {
  const token = createToken()
  const tokenHash = await hashing.argon2.hash(token)
  const lookupHash = await generateLookupHash(token)

  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

  await database.client.refreshToken.create({
    data: {
      token_hash: tokenHash,
      lookup_hash: lookupHash,
      family_id: familyId,
      user_id: user.id,
      expires_at: new Date(Date.now() + thirtyDaysInMs),
      revoked: false,
    },
  })
  return token
}

export const generateLookupHash = async (token: string): Promise<string> => {
  return await hashing.hmac.hash(
    token,
    process.env.REFRESH_TOKEN_LOOKUP_SECRET!
  )
}

export const validateRefreshToken = async (
  token: string
): Promise<Result<RefreshToken & { user: User }, RefreshTokenError>> => {
  const result = await findRefreshToken(token)

  if (!result.ok) {
    return Result.error(new RefreshTokenInvalidError())
  }
  const refreshToken = result.data

  if (refreshToken.revoked) {
    await revokeTokenFamily(refreshToken.family_id)
    return Result.error(new RefreshTokenReusedError())
  }
  if (new Date() > refreshToken.expires_at) {
    return Result.error(new RefreshTokenExpiredError())
  }
  const comparison = await hashing.argon2.compare(
    token,
    refreshToken.token_hash
  )
  if (!comparison) {
    return Result.error(new RefreshTokenInvalidError())
  }
  return Result.success(refreshToken)
}

export const findRefreshToken = async (
  token: string
): Promise<Result<RefreshToken & { user: User }, ResourceMissingError>> => {
  const lookupHash = await generateLookupHash(token)
  const refreshToken = await database.client.refreshToken.findUnique({
    where: {
      lookup_hash: lookupHash,
    },
    include: {
      user: true,
    },
  })

  if (refreshToken) {
    return Result.success(refreshToken)
  }
  return Result.error(
    new ResourceMissingError(
      "Refresh token is not found.",
      "REFRESH_TOKEN_NOT_FOUND"
    )
  )
}

export const revokeTokenFamily = async (familyId: string) => {
  await database.client.refreshToken.updateMany({
    where: { family_id: familyId },
    data: { revoked: true },
  })
}

export const revokeRefreshToken = async (lookupHash: string): Promise<void> => {
  await database.client.refreshToken.updateMany({
    where: {
      lookup_hash: lookupHash,
    },
    data: {
      revoked: true,
    },
  })
}

export const revokeUserRefreshTokens = async (
  userId: string
): Promise<void> => {
  await database.client.refreshToken.updateMany({
    where: {
      user_id: userId,
    },
    data: {
      revoked: true,
    },
  })
}

const createToken = (): string => {
  return crypto.randomBytes(40).toString("hex")
}
