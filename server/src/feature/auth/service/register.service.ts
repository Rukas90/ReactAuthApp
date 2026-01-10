import { database } from "#lib/app/database.js"
import { ConflictError, UnexpectedError } from "#lib/common/domain.error.js"
import { Result } from "#lib/common/result.js"
import { hashing } from "#lib/security/hasher.service.js"
import { Prisma } from "#prisma/client"
import { TokenPair } from "../utils/auth.type"
import { generateAuthTokens } from "./auth.service"

export const register = async (
  email: string,
  password: string
): Promise<Result<TokenPair, ConflictError>> => {
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
