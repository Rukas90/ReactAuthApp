import { getUserByEmail } from "@features/user"
import { InvalidCredentialsError } from "@shared/errors"
import { hashing } from "@shared/security"
import { User } from "@prisma/client"
import { Result } from "@shared/types"

export const loginWithCredentials = async (
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
