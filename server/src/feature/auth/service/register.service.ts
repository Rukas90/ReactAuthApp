import { database } from "@base/app"
import {
  AuthEmailAlreadyExistError,
  AuthRegistrationFailedError,
} from "../error/auth.error"
import { Result } from "@project/shared"
import { hashing } from "@shared/security"
import { Prisma, User } from "@prisma/client"

const registerService = {
  createNewUser: async (
    email: string,
    password: string,
  ): Promise<
    Result<User, AuthEmailAlreadyExistError | AuthRegistrationFailedError>
  > => {
    const passwordHashed = await hashing.argon2.hash(password)
    try {
      const newUser = await database.client.user.create({
        data: {
          email: email,
          password_hash: passwordHashed,
          is_verified: false,
        },
      })
      return Result.success(newUser)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return Result.error(new AuthEmailAlreadyExistError())
      }
      return Result.error(new AuthRegistrationFailedError())
    }
  },
}
export default registerService
