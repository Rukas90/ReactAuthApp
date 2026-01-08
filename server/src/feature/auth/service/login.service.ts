import { getUserByEmail } from "#features/user/service/user.service"
import { hashing } from "#lib/security/hasher.service.js"
import { User } from "#prisma/client"
import { generateAccessToken } from "#lib/token/jwt.service.js"
import {
  generateRefreshToken,
  revokeUserRefreshTokens,
  validateRefreshToken,
} from "#lib/token/refresh.service.js"
import { TokenAuthState, TokenPair } from "../utils/auth.type"
import { Result } from "#lib/common/result.js"
import { InvalidCredentialsError } from "#lib/common/business.error.js"

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
  const tokens = await generateLoginTokens(
    user,
    user.tfa_active ? "2fa-pending" : "authenticated"
  )
  return Result.success(tokens)
}

export const generateLoginTokens = async (
  user: User,
  state: TokenAuthState
) => {
  const accessToken = await generateAccessToken(user, state)
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
