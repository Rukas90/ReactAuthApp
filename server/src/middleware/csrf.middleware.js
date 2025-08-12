import { syncCSRFSecret } from '#controllers/csrf.controller.js'
import { logDevError } from '#services/logger.js'

export const verifyCsrfTokenMiddleware = (req, res, next) => {
    try {
        const tokens = req.app.locals.csrfTokens
        const token  = req.cookies["X-CSRF-Token"]

        if (!req.session || !tokens.verify(req.session.csrfSecret, token)) {
            logDevError("Invalid CSRF token")
            return res.status(400).json({ error: "Invalid CSRF token" })
        }
        next()
    }
    catch (error) {
        logDevError("Error when validating a CSRF token:", error)
        return res.status(403).json({ error: error.message })
    }
}
export const syncCSRFSecretMiddleware = (req, res, next) => {
    if (!req.session) {
        return res.status(403).json({ error: "Session not found" })
    }
    syncCSRFSecret(req)
    next()
}