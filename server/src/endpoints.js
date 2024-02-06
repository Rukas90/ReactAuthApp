
import passport from 'passport'
import { 
    captureSessionInfo, 
    isAuthenticated,
    validateSession2FAState
} from './middlewares.js'
import { 
    get_auth_status, 
    register_user, 
    verify_verification_code, 
    log_out_user ,
    oauthIdentify
} from './auth.js'
import { 
    get_2fa_status, 
    get_2fa_data, 
    verify_2fa,
    auth_2fa,
    deactivate_2fa
} from './2fa.js'
import { 
    check_verification_code, 
    send_verification_code, 
    clear_verification_code 
} from './verification.js'
import { 
    updateUserPassword, 
    verifyUserPassword,
    deleteUserAccount
} from './account.js'
import { getPath } from './utils.js'
import { passportStrategyCallback } from './passport-auth.js'

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
        this.server.app.post('/auth/login',    cSRFTokenVerification, passport.authenticate('local', (error, user, info) => passportStrategyCallback(error, user, info, res)), syncCSRFSecret, captureSessionInfo, validateSession2FAState, 
            async (req, res) => res
                .status(200)
                .cookie('X-CSRF-Token', this.server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: process.env.SAME_SITE })
                .json({ message: "Authentication successful", redirectUrl: process.env.CLIENT_ORIGIN }))

        // Google Auth

        this.server.app.get('/auth/google',          passport.authenticate('google', { scope: ['profile', 'email'] }))
        this.server.app.get('/auth/google/register', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }))
        this.server.app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: getPath([process.env.CLIENT_ORIGIN, '/login']) }), syncCSRFSecret, captureSessionInfo, validateSession2FAState, 
            (req, res) => res
                .status(200)
                .cookie('X-CSRF-Token', this.server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: process.env.SAME_SITE })
                .redirect(process.env.CLIENT_ORIGIN))

        // Github Auth

        this.server.app.get('/auth/github',          passport.authenticate('github', { scope: ['user:email'] }))
        this.server.app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: getPath([process.env.CLIENT_ORIGIN, '/login']) }), syncCSRFSecret, captureSessionInfo, validateSession2FAState,
            (req, res) => res
            .status(200)
            .cookie('X-CSRF-Token', this.server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: process.env.SAME_SITE })
            .redirect(process.env.CLIENT_ORIGIN))

        this.server.app.get('/auth/2fa/status',  isAuthenticated, async (req, res) => await get_2fa_status(req, res, this.server))
        this.server.app.get('/auth/2fa/data',    isAuthenticated, async (req, res) => await get_2fa_data(req, res, this.server))
        this.server.app.post('/auth/2fa/verify', cSRFTokenVerification, isAuthenticated, async (req, res) => await verify_2fa(req, res, this.server))
        this.server.app.post('/auth/2fa',        cSRFTokenVerification, isAuthenticated, async (req, res) => await auth_2fa(req, res, this.server))
        this.server.app.delete('/auth/2fa',      cSRFTokenVerification, isAuthenticated, async (req, res) => await deactivate_2fa(req, res, this.server))

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
        this.server.app.get('/session/user', isAuthenticated, async (req, res) => {
            return res.status(200).json(await this.server.database.getUserMetadata(req.user.id))
        })

        // OAuth

        this.server.app.get('/oauth/providers', isAuthenticated, async (req, res) => {
            return res.status(200).json({ providers: await this.server.database.getOAuthProviders(req.user.id) })
        })
        this.server.app.post('/oauth/identify', cSRFTokenVerification, async (req, res) => {
            if (!req.session.pendingOAuth) {
                return res.status(400)
            }
            return await oauthIdentify(req, res, this.server)
        })

        // Verification 

        this.server.app.post('/verify/send-code',  cSRFTokenVerification, isAuthenticated, async (req, res) => await send_verification_code(req, res))
        this.server.app.post('/verify/check-code', cSRFTokenVerification, isAuthenticated, async (req, res) => await check_verification_code(req, res))
        this.server.app.post('/verify/cancel',     cSRFTokenVerification, isAuthenticated, async (req, res) => await clear_verification_code(req, res))
   
        // Account

        this.server.app.post('/user/password/verify', cSRFTokenVerification, isAuthenticated, async (req, res) => await verifyUserPassword(req, res))
        this.server.app.post('/user/password/update', cSRFTokenVerification, isAuthenticated, async (req, res) => await updateUserPassword(req, res))
        this.server.app.post('/user/delete', cSRFTokenVerification, isAuthenticated, async (req, res) => await deleteUserAccount(req, res))
    
        // Utils

        
    }
}