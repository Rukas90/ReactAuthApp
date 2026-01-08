import { database } from "#lib/app/database.js"
import { ResourceMissingError } from "#lib/common/domain.error.js"
import { Result } from "#lib/common/result.js"
import { hashing } from "#lib/security/hasher.service.js"
import { RefreshToken, User } from "#prisma/client"
import crypto from "crypto"

export const generateRefreshToken = async (user: User): Promise<string> => {
  const token = createToken()
  const tokenHash = await hashing.argon2.hash(token)
  const familyId = crypto.randomUUID()
  const lookupHash = await generateLookupHash(token)

  await database.client.refreshToken.create({
    data: {
      token_hash: tokenHash,
      lookup_hash: lookupHash,
      family_id: familyId,
      user_id: user.id,
      expires_at: new Date(Date.now() + "30d"),
      revoked: false,
    },
  })
  return token
}
export const findRefreshToken = async (
  token: string
): Promise<Result<RefreshToken, ResourceMissingError>> => {
  const lookupHash = await generateLookupHash(token)
  const refreshToken = await database.client.refreshToken.findUnique({
    where: {
      lookup_hash: lookupHash,
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
      revoked: false,
    },
    data: {
      revoked: true,
    },
  })
}
const createToken = (): string => {
  return crypto.randomBytes(40).toString("hex")
}
export const generateLookupHash = async (token: string): Promise<string> => {
  return await hashing.hmac.hash(
    token,
    process.env.REFRESH_TOKEN_LOOKUP_SECRET!
  )
}
export const validateRefreshToken = async (token: string): Promise<boolean> => {
  const result = await findRefreshToken(token)

  if (!result.ok) {
    return false
  }
  const refreshToken = result.data
  return (
    !refreshToken.revoked &&
    hashing.argon2.compare(token, refreshToken.token_hash)
  )
}
