import { isSessionBlocked } from "#controllers/session.controller.js"
import { logDevMessage } from "#services/logger.js"

export const checkSessionBlockedMiddleware = async (req, res, next) => {
    try {
        const blocked = await isSessionBlocked(req)

        if (blocked) {
            return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
        }
        next()
        
    } catch (error) {
        logDevMessage("CheckSessionBlockStatus::Error:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}