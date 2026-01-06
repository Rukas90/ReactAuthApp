import { database } from '#lib/app/database.js'
import { ResourceMissingError } from '#lib/common/domain.error.js'
import { Result } from '#lib/common/result.js'
import { User } from '#prisma/client'

export const getUserByEmail = async (email: string)
: Promise<Result<User, ResourceMissingError>> => 
{
    const user = await database.client.user.findUnique({ where: { email: email } })
    return user 
            ? Result.success(user) 
            : Result.error(new ResourceMissingError("User not found", 'USER_NOT_FOUND'))
}
export const getUserById = async (id: string)
: Promise<Result<User, ResourceMissingError>> => 
{
    const user = await database.client.user.findUnique({ where: { id } })
    return user 
            ? Result.success(user) 
            : Result.error(new ResourceMissingError("User not found", 'USER_NOT_FOUND'))
}