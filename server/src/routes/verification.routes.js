import { getCreateVerification, verifyVerification } from '#controllers/verification.controller.js'
import { checkAuthMiddleware } from '#middleware/auth.middleware.js'
import { verifyCsrfTokenMiddleware } from '#middleware/csrf.middleware.js'
import { checkSessionBlockedMiddleware } from '#middleware/session-blocked.middleware.js'

export const registerVerificationRoutes = (server) => {
    
    server.app.post('/verifications', verifyCsrfTokenMiddleware, checkAuthMiddleware, checkSessionBlockedMiddleware, async (req, res) => {
        return await getCreateVerification(req, res)
    })
    server.app.post('/verifications/verify', verifyCsrfTokenMiddleware, checkAuthMiddleware, checkSessionBlockedMiddleware, async (req, res) => {
        return await verifyVerification(req, res)
    })
}