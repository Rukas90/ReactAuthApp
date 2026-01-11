import { database } from "@base/app"
import { ResourceMissingError } from "@shared/errors"
import { Result } from "@shared/types"
import { User } from "@prisma/client"

export const getUserByEmail = async (
  email: string
): Promise<Result<User, ResourceMissingError>> => {
  const user = await database.client.user.findUnique({
    where: { email: email },
  })
  return user
    ? Result.success(user)
    : Result.error(new ResourceMissingError("User not found", "USER_NOT_FOUND"))
}
export const getUserById = async (
  id: string
): Promise<Result<User, ResourceMissingError>> => {
  const user = await database.client.user.findUnique({ where: { id } })
  return user
    ? Result.success(user)
    : Result.error(new ResourceMissingError("User not found", "USER_NOT_FOUND"))
}
