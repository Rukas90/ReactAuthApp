import { database } from "#lib/app/database.js"
import { hashing } from "#lib/security/hasher.service.js"
import { TokenPair } from "./auth.type"
import { generateLoginTokens } from "./login.service"

export const register = async (
  email: string,
  password: string
): Promise<TokenPair> => {
  const passwordHashed = await hashing.argon2.hash(password)
  // The creation of new user will automatically fail
  // if registering user email is not unique in the db
  const newUser = await database.client.user.create({
    data: {
      email: email,
      password_hash: passwordHashed,
      is_verified: false,
    },
  })
  return await generateLoginTokens(newUser)
}
