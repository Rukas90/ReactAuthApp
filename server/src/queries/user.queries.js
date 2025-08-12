import { usersDBTable, usersDBTableSchema } from "#config/user.db.config.js"
import { getNewUser }                       from "#models/user.model.js"
import { database }                         from "#services/database.service.js"
import { logDevError }                      from "#services/logger.js"

export const DEFAULT_USER_FIELDS = ['id', 'email', 'is_verified']

export const getUserById = async (id, fields = DEFAULT_USER_FIELDS, client = null, releaseClientAfter = true) => {
    try {
        const result = await database.fetch(fields, usersDBTableSchema, usersDBTable, 'id', id, 
            client, releaseClientAfter)

        if (!result || result.rowCount <= 0) {
            return null
        }
        return result.rows[0]
    }
    catch (error) {
        logDevError('Database get user by id error', error.stack)
        throw error
    }
}
export const getUserByEmail = async (email, fields = DEFAULT_USER_FIELDS, client = null, releaseClientAfter = true) => {

    try {
        
        const result = await database.fetch(fields, usersDBTableSchema, usersDBTable, 'email', email, 
            client, releaseClientAfter)

        if (!result || result.rowCount <= 0) {
            return null
        }
        return result.rows[0]
    }
    catch (error) {
        logDevError('Database get user by email error', error.stack)
        throw error
    }
}

export const getUserMetadata = async (id, client = null, releaseClientAfter = true) => {
    const password = await getUserPassword(id, client, releaseClientAfter)

    return {
        userID:      id,
        hasPassword: password !== null && password !== undefined,
    }
}

export const setUserPassword = async (id, passwordHash, client = null, releaseClientAfter = true) => {
    try {
        await database.update(usersDBTable, 'password', passwordHash, 'id', id,
            client, releaseClientAfter)
    }
    catch (error) {
        logDevError('Database set user password error', error.stack)
        throw error
    }
}
export const getUserPassword = async (id, client = null, releaseClientAfter = true) => {
    try {
        
        const result = await database.fetch('password', usersDBTableSchema, usersDBTable, 'id', id, 
            client, releaseClientAfter)

        if (!result || result.rowCount <= 0) {
            return undefined
        }
        return result.rows[0].password
    }
    catch (error) {
        logDevError('Database get user password error', error.stack)
        throw error
    }
}

export const createUser = async (email, passwordHash, client = null, releaseClientAfter = true) => {
   try {
       let newUser = getNewUser(email, passwordHash)

       await database.push(usersDBTable, newUser, usersDBTableSchema, client, releaseClientAfter)
       return newUser
   }
   catch (error) {
       logDevError('Database create user error', error.stack)
       throw error
   }
}
export const createLinkedNewUser = async (email, client = null, releaseClientAfter = true) => {
    try {
        let newUser = getNewUser(email, null)
        newUser.is_verified = true

        await database.push(usersDBTable, newUser, usersDBTableSchema, client, releaseClientAfter)
        return newUser
    }
    catch (error) {
        logDevError('Database create linked user error', error.stack)
        throw error
    }
}

export const removeUser = async (id, client = null, releaseClientAfter = true) => {
    try {
        await database.remove(usersDBTable, 'id', id, client, releaseClientAfter)
    }
    catch (error) {
        logDevError('Database remove user error', error.stack)
        throw error
    }
}
export const setUserVerifiedState = async (id, state, client = null, releaseClientAfter = true) => {
    await database.update(usersDBTable, 'is_verified', state, 'id', id,
        client, releaseClientAfter
    )
}