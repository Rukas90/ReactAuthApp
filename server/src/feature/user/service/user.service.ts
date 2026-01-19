import { database } from "@base/app"
import { ResourceMissingError } from "@shared/errors"
import { Result } from "@project/shared"
import { User } from "@prisma/client"

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await database.client.user.findUnique({
    where: { email: email },
  })
}
export const getUserById = async (
  id: string
): Promise<Result<User, ResourceMissingError>> => {
  const user = await database.client.user.findUnique({ where: { id } })
  return user
    ? Result.success(user)
    : Result.error(new ResourceMissingError("User not found", "USER_NOT_FOUND"))
}
export const createNewUser = async (
  email: string,
  isVerified: boolean
): Promise<User> => {
  return await database.client.user.create({
    data: {
      email,
      is_verified: isVerified,
    },
  })
}
export const verifyUser = async (userId: string): Promise<User> => {
  return database.client.user.update({
    where: {
      id: userId,
    },
    data: {
      is_verified: true,
    },
  })
}
