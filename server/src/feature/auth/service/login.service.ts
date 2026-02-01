import { userService } from "@features/user"
import { hashing } from "@shared/security"
import { User } from "@prisma/client"
import { Result, VoidResult } from "@project/shared"
import { AuthInvalidCredentialsError } from "../error/auth.error"

const loginService = {
  loginWithCredentials: async (
    email: string,
    password: string,
  ): Promise<Result<User, AuthInvalidCredentialsError>> => {
    if (!email || !password) {
      return Result.error(new AuthInvalidCredentialsError())
    }
    const user = await userService.getUserByEmail(email)

    if (!user.ok) {
      return Result.error(new AuthInvalidCredentialsError())
    }
    if (!user.data.password_hash) {
      return Result.error(new AuthInvalidCredentialsError())
    }
    const validation = await loginService.validatePassword(
      password,
      user.data.password_hash,
    )

    if (!validation.ok) {
      return validation
    }
    return Result.success(user.data)
  },
  validatePassword: async (
    input: string,
    hashedPassword: string,
  ): Promise<VoidResult<AuthInvalidCredentialsError>> => {
    return (await hashing.argon2.compare(input, hashedPassword))
      ? VoidResult.ok()
      : VoidResult.error(new AuthInvalidCredentialsError())
  },
}
export default loginService
