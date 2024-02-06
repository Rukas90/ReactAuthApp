import { 
    blockedSessionsDBTable, 
    getBlockedSessionsDBTableSchema, 
    userSessionValidation 
} from "./utils.js"

export const isSessionBlocked = async (req) => {
    if (!userSessionValidation) {
        return false
    }
    const sessionID = req.user.sessionID
    const database  = req.app.locals.database

    try {
        if (!req.session.blocked) {
            return false
        }
        const blocked = await database.getBlockedSession(sessionID)

        if (!blocked) {
            return false
        }
        const expired = new Date(blocked.block_end_time) < new Date()

        if (expired) {
            await database.remove(blockedSessionsDBTable, 'session_id', sessionID)
        }
        const isBlocked     = !expired
        req.session.blocked = isBlocked

        return isBlocked
    }
    catch (error) {
        console.error('Error in isSessionBlocked:', error)
        return true
    }
}
export const blockSession = async (req, reason, duration) => {
    if (!userSessionValidation) {
        return false
    }
    try {
        let blockDuration = duration

        if (req.session.blocked) {
            const existingBlock     = await database.getBlockedSession(sessionID)
            const remainingDuration = existingBlock.block_end_time - new Date()

            if (remainingDuration > 0) {
                blockDuration += Math.ceil(remainingDuration / 1000)
            }
        }
        const database  = req.app.locals.database
        const date      = new Date()
    
        const sessionID = req.user.sessionID
        const blockData = {
            session_id:         sessionID,
            block_reason:       reason,
            block_start_time:   date,
            block_duration:     blockDuration,
            block_end_time:     new Date(date.getTime() + blockDuration * 1000)
        }
        req.session.blocked = true
    
        await database.push(blockedSessionsDBTable, blockData, getBlockedSessionsDBTableSchema())
    }
    catch (error) {
        console.error('Error in blockSession:', error)
    }
}