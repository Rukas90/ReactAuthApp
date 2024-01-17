
import passport from 'passport'
import { 
    captureSessionInfo, 
    isAuthenticated, 
} from './middlewares.js'
import { 
    get_auth_status, 
    register_user, 
    verify_verification_code, 
    log_out_user 
} from './auth.js'
import { 
    get_2fa_status, 
    get_2fa_data, 
    verify_2fa_code,
    deactivate_2fa
} from './2fa.js'

export class Endpoints {
    constructor(server) {
        this.server = server

        this.#initialize()
    }
    #initialize() {
        
        // Middlewares...

        const cSRFTokenVerification = this.server.cSRFTokenVerification
        const syncCSRFSecret        = this.server.syncCSRFSecretMiddleware

        // Basic Auth
        
        this.server.app.post('/auth/register', cSRFTokenVerification, async (req, res) => await register_user(req, res, this.server))
        this.server.app.post('/auth/login',    cSRFTokenVerification, passport.authenticate('local'), syncCSRFSecret, captureSessionInfo, 
            async (req, res) => 
                res
                .status(200)
                .cookie('X-CSRF-Token', this.server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: process.env.SAME_SITE })
                .redirect(process.env.CLIENT_ORIGIN))

        // Google Auth

        this.server.app.get('/auth/google',          passport.authenticate('google', { scope: ['profile', 'email'] }))
        this.server.app.get('/auth/google/register', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }))
        this.server.app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), syncCSRFSecret, captureSessionInfo, 
            (req, res) => 
                res
                .status(200)
                .cookie('X-CSRF-Token', this.server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: process.env.SAME_SITE })
                .redirect(process.env.CLIENT_ORIGIN))

        this.server.app.get('/auth/2fa/status', isAuthenticated, async (req, res) => await get_2fa_status(req, res, this.server))
        this.server.app.get('/auth/2fa',        isAuthenticated, async (req, res) => await get_2fa_data(req, res, this.server))
        this.server.app.post('/auth/2fa',       cSRFTokenVerification, isAuthenticated, async (req, res) => await verify_2fa_code(req, res, this.server))
        this.server.app.delete('/auth/2fa',     cSRFTokenVerification, isAuthenticated, async (req, res) => await deactivate_2fa(req, res, this.server))

        // Auth Validate

        this.server.app.get('/auth/status',  (req, res) => get_auth_status(req, res))
        this.server.app.post('/auth/verify', cSRFTokenVerification, isAuthenticated, async (req, res) => await verify_verification_code(req, res, this.server))

        // Log out

        this.server.app.post('/auth/logout', cSRFTokenVerification, isAuthenticated, (req, res) => log_out_user(req, res, this.server))
    
        // Sessions

        this.server.app.get('/session', isAuthenticated, async (req, res) => {
            return res.status(200).json({ sessionID: req.user.sessionID })
        })
        this.server.app.get('/sessions', isAuthenticated, async (req, res) => {
            return res.status(200).json({ sessions: await this.server.database.getUserSessions(req.user.id), user: {
                sessionID: req.user.sessionID
            } })
        })
    }
}