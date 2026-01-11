import { database } from "@base/app"
import { ConflictError, UnexpectedError } from "@shared/errors"
import { Result } from "@shared/types"
import { hashing } from "@shared/security"
import { Prisma } from "@prisma/client"
import { generateAuthTokens } from "./auth.service"
import { TokenPair } from "../util/auth.type"

export const register = async (
  email: string,
  password: string
): Promise<Result<TokenPair, ConflictError | UnexpectedError>> => {
  const passwordHashed = await hashing.argon2.hash(password)

  // The creation of new user will automatically fail
  // if registering user email is not unique in the db
  try {
    const newUser = await database.client.user.create({
      data: {
        email: email,
        password_hash: passwordHashed,
        is_verified: false,
        tfa_active: false,
      },
    })
    const tokens = await generateAuthTokens(newUser)
    return Result.success(tokens)
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
