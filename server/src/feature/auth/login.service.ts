import { getUserByEmail } from "src/feature/user/user.service"
import { AccessDeniedError } from "#lib/common/domain.error.js"
import { hashing } from "#lib/security/hasher.service.js"
import { User } from "#prisma/client"
import { generateAccessToken } from "#lib/token/jwt.service.js"
import {
  generateRefreshToken,
  revokeUserRefreshTokens,
  validateRefreshToken,
} from "#lib/token/refresh.service.js"
import { TokenPair } from "./auth.type"
import { Result } from "#lib/common/result.js"

const INVALID_CREDENTIALS_ERROR = () =>
  Result.error(
    new AccessDeniedError("Invalid credentials", "INVALID_CREDENTIALS")
  )

export const login = async (
  email: string,
  password: string,
  existingRefreshToken?: string
): Promise<Result<TokenPair, AccessDeniedError>> => {
  const result = await loginWithCredentials(email, password)

  if (!result.ok) {
    return result
  }
  const user = result.data

  if (existingRefreshToken) {
    await validateRefreshTokenReuse(user, existingRefreshToken)
  }
  const tokens = await generateLoginTokens(user)
  return Result.success(tokens)
}

export const generateLoginTokens = async (user: User) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user)

  return {
    accessToken,
    refreshToken,
  } as TokenPair
}

const validateRefreshTokenReuse = async (
  user: User,
  existingRefreshToken: string
): Promise<void> => {
  const isValid = await validateRefreshToken(existingRefreshToken)

  if (!isValid) {
    return await revokeUserRefreshTokens(user.id)
  }
}

const loginWithCredentials = async (
  email: string,
  password: string
): Promise<Result<User, AccessDeniedError>> => {
  if (!email || !password) {
    return INVALID_CREDENTIALS_ERROR()
  }
  const result = await getUserByEmail(email)

  if (!result.ok) {
    return INVALID_CREDENTIALS_ERROR()
  }
  const user = result.data
  const isPasswordValid = await validatePassword(password, user.password_hash)

  if (!isPasswordValid) {
    return INVALID_CREDENTIALS_ERROR()
  }
  return Result.success(user)
}

const validatePassword = async (
  input: string,
  hashedPassword: string
): Promise<boolean> => {
  return await hashing.argon2.compare(input, hashedPassword)
}
