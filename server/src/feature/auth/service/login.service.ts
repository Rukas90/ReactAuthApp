import { getUserByEmail } from "@features/user"
import { hashing } from "@shared/security"
import { User } from "@prisma/client"
import { Result } from "@project/shared"
import { AuthInvalidCredentialsError } from "../error/auth.error"

export const loginWithCredentials = async (
  email: string,
  password: string,
): Promise<Result<User, AuthInvalidCredentialsError>> => {
  if (!email || !password) {
    return Result.error(new AuthInvalidCredentialsError())
  }
  const user = await getUserByEmail(email)

  if (!user) {
    return Result.error(new AuthInvalidCredentialsError())
  }
  if (!user.password_hash) {
    return Result.error(new AuthInvalidCredentialsError())
  }
  const isPasswordValid = await validatePassword(password, user.password_hash)

  if (!isPasswordValid) {
    return Result.error(new AuthInvalidCredentialsError())
  }
  return Result.success(user)
}

const validatePassword = async (
  input: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await hashing.argon2.compare(input, hashedPassword)
}
