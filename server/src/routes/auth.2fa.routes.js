import { 
    checkAuthMiddleware,
} from '#middleware/auth.middleware.js'
import { 
    get2FAStatus, 
    get2FAData, 
    verify2FA,
    auth2FA,
    deactivate2FA
} from '#controllers/auth.2fa.controller.js'
import { 
    verifyCsrfTokenMiddleware
} from '#middleware/csrf.middleware.js'

export const register2FARoutes = (server) => {

   server.app.get('/auth/2fa/status', checkAuthMiddleware, async (req, res) => await get2FAStatus(req, res))
   server.app.get('/auth/2fa/data', checkAuthMiddleware, async (req, res) => await get2FAData(req, res))
   server.app.post('/auth/2fa/verify', verifyCsrfTokenMiddleware, checkAuthMiddleware, async (req, res) => await verify2FA(req, res))
   server.app.post('/auth/2fa', verifyCsrfTokenMiddleware, checkAuthMiddleware, async (req, res) => await auth2FA(req, res))
   server.app.delete('/auth/2fa', verifyCsrfTokenMiddleware, checkAuthMiddleware, async (req, res) => await deactivate2FA(req, res))

}