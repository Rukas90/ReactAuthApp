import { database }                                             from "#services/database.service.js"
import { blockedSessionsDBTable, blockedSessionsDBTableSchema } from "#config/blocked-sessions.db.config.js"
import { logDevError }                                          from "#services/logger.js"
import { getNewBlockedSession }                                 from "#models/blocked.session.model.js"

export const getBlockedSession = async (sessionID, client = null, releaseClientAfter = true) => {
    try {
        const result = await database.fetch('*', blockedSessionsDBTableSchema, blockedSessionsDBTable, 'session_id', sessionID, 
            client, releaseClientAfter)

        if (!result || result.rowCount <= 0) {
            return null
        }
        return result.rows[0]
    }
    catch (error) {
        logDevError('Database get blocked session error', error.stack)
        throw error
    }
}
export const removeBlockedSession = async (sessionID, client = null, releaseClientAfter = true) => {
    try {
        await database.remove(blockedSessionsDBTable, 'session_id', sessionID,
            client, releaseClientAfter)
    }
    catch (error) {
        logDevError('Database remove blocked session error', error.stack)
        throw error
    }
}
export const createNewBlockedSession = async (sessionID, reason, duration, client = null, releaseClientAfter = true) => {
    try {
        const data = getNewBlockedSession(sessionID, reason, duration)
        await database.push(blockedSessionsDBTable, data, blockedSessionsDBTableSchema,
            client, releaseClientAfter)
    }
    catch (error) {
        logDevError('Database create new blocked session error', error.stack)
        throw error
    }
}