import { createNewBlockedSession, getBlockedSession, removeBlockedSession } from "#queries/blocked.session.queries.js"
import { logDevError }                                                      from "#services/logger.js"

export const isSessionBlocked = async (req) => {
    const sessionID = req.user.sessionID

    try {
        if (!req.session.blocked) {
            return false
        }
        const blocked = await getBlockedSession(sessionID)

        if (!blocked) {
            return false
        }
        const expired = new Date(blocked.block_end_time) < new Date()

        if (expired) {
            await removeBlockedSession(sessionID)
        }
        const isBlocked     = !expired
        req.session.blocked = isBlocked

        return isBlocked
    }
    catch (error) {
        logDevError('Error in isSessionBlocked:', error)
        return true
    }
}
export const blockSession = async (req, reason, duration) => {
    try {
        const sessionID     = req.user.sessionID
        let   blockDuration = duration

        if (req.session.blocked) {
            const existingBlock     = await getBlockedSession(sessionID)
            const remainingDuration = existingBlock.block_end_time - new Date()

            if (remainingDuration > 0) {
                blockDuration += Math.ceil(remainingDuration / 1000)
            }
        }    
        await createNewBlockedSession(sessionID, reason, blockDuration)
        req.session.blocked = true
    }
    catch (error) {
        logDevError('Error in blockSession:', error)
    }
}