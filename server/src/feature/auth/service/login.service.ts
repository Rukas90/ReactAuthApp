import { getUserByEmail } from "#features/user/service/user.service"
import { hashing } from "#lib/security/hasher.service.js"
import { User } from "#prisma/client"
import {
  revokeUserRefreshTokens,
  validateRefreshToken,
} from "#lib/token/refresh.service.js"
import { TokenPair } from "../utils/auth.type"
import { Result } from "#lib/common/result.js"
import { InvalidCredentialsError } from "#lib/common/business.error.js"
import { generateAuthTokens } from "./auth.service"

export const login = async (
  email: string,
  password: string,
  existingRefreshToken?: string
): Promise<Result<TokenPair, InvalidCredentialsError>> => {
  const result = await loginWithCredentials(email, password)

  if (!result.ok) {
    return result
  }
  const user = result.data

  if (existingRefreshToken) {
    await validateRefreshTokenReuse(user, existingRefreshToken)
  }
  const tokens = await generateAuthTokens(user)
  return Result.success(tokens)
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
): Promise<Result<User, InvalidCredentialsError>> => {
  if (!email || !password) {
    return Result.error(new InvalidCredentialsError())
  }
  const result = await getUserByEmail(email)

  if (!result.ok) {
    return Result.error(new InvalidCredentialsError())
  }
  const user = result.data
  const isPasswordValid = await validatePassword(password, user.password_hash)

  if (!isPasswordValid) {
    return Result.error(new InvalidCredentialsError())
  }
  return Result.success(user)
}

const validatePassword = async (
  input: string,
  hashedPassword: string
): Promise<boolean> => {
  return await hashing.argon2.compare(input, hashedPassword)
}
