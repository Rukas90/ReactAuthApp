import { database } from "#services/database.service.js"
import 
{ 
    sessionsDBTable, 
    sessionsDBTableSchema 
}            from "#config/sessions.db.config.js"
import geoip from 'geoip-lite'

export const getUserSessions = async (userID, client = null, releaseClientAfter = true) => {
    
    const data = await database.fetch('*', sessionsDBTableSchema, sessionsDBTable, 'user_id', userID, 
        client, releaseClientAfter)

    if (!data || data.rowCount < 1) {
        return null
    }
    const sessions = data.rows.map(session => {
        const geo  = geoip.lookup(session.ip_address)
        return {
            ...session,
            geo: geo ? { latitude: geo.ll[0], longitude: geo.ll[1] } : null
        }
    })
    return sessions
}
export const removeUserSession = async (userID, client = null, releaseClientAfter = true) => {
    await database.remove(sessionsDBTable, 'user_id', userID, 
        client, releaseClientAfter)
}
export const getExistingSession = async (userID, ip, type, source, client = null, releaseClientAfter = true) => {
    const result = await database.fetch('*', sessionsDBTableSchema, sessionsDBTable, 
        ['user_id', 'ip_address', 'device_type', 'source'], 
        [userID, ip, type, source] , client, releaseClientAfter) 

    if (!result || result.rowCount <= 0) {
        return null
    }
    return result.rows[0]
}
export const updateUserSessionActivity = async (sessionID, lastActivityTime, client = null, releaseClientAfter = true) => {
    await database.update(sessionsDBTable, 'last_activity_time', lastActivityTime, 'session_id', sessionID, 
        client, releaseClientAfter)
}
export const addNewUserSession = async (sessionData, client = null, releaseClientAfter = true) => {
    await database.push(sessionsDBTable, sessionData, sessionsDBTableSchema, client, releaseClientAfter)
}