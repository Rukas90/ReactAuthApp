import { database } from "@base/app"
import { ConflictError, UnexpectedError } from "@shared/errors"
import { Result } from "@shared/types"
import { hashing } from "@shared/security"
import { Prisma, User } from "@prisma/client"

export const createNewUser = async (
  email: string,
  password: string
): Promise<Result<User, ConflictError | UnexpectedError>> => {
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
      return Result.error(
        new ConflictError(
          "An account with this email already exists.",
          "EMAIL_ALREADY_EXISTS"
        )
      )
    }
    return Result.error(
      new UnexpectedError(
        "An unexpected error occurred during registration",
        "REGISTRATION_ERROR"
      )
    )
  }
}
