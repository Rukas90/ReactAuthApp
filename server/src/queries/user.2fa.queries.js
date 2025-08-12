import { usersDBTable, usersDBTableSchema } from "#config/user.db.config.js"
import { database }                         from "#services/database.service.js"
import { logDevError }                      from "#services/logger.js"

export const setUser2FASecret = async (id, secret, client = null, releaseClientAfter = true) => {
    try {
        await database.update(usersDBTable, 'two_fa_secret', secret, 'id', id,
            client, releaseClientAfter)
    }
    catch (error) {
        logDevError('Database update 2fa secret error', error.stack)
        throw error
    }
}
export const getUser2FASecret = async (id, client = null, releaseClientAfter = true) => {
    try {
        const result = await database.fetch('two_fa_secret', usersDBTableSchema, usersDBTable, 'id', id, 
            client, releaseClientAfter)

        if (!result || result.rowCount <= 0) {
            return null
        }
        return result.rows[0].two_fa_secret
    }
    catch (error) {
        logDevError('Database get 2fa secret error', error.stack)
        throw error
    }
}

export const setUser2FAActiveState = async (id, state) => {
    if (typeof state !== 'boolean') {
        throw new Error(`Unsupported state type! Expected boolean but received ${typeof state}`);
    }
    await database.update(usersDBTable, 'two_fa_active', state, 'id', id)
}
export const getUser2FAActiveState = async (id, client = null, releaseClientAfter = true) => {
    try {
        const result = await database.fetch('two_fa_active', usersDBTableSchema, usersDBTable, 'id', id, 
            client, releaseClientAfter)

        if (!result || result.rowCount <= 0) {
            return false
        }
        return result.rows[0].two_fa_active
    }
    catch (error) {
        logDevError('Database get 2fa active state error', error.stack)
        throw error
    }
}

export const clearUser2FA = async (id) => {
    const operation = async (client) => {
        await database.update(usersDBTable, 'two_fa_secret', '', 'id', id, 
            client, false)
        await database.update(usersDBTable, 'two_fa_active', false, 'id', id, 
            client, false)
    }
    await database.transaction(operation)
}