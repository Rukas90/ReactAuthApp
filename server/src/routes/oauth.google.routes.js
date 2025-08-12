
import passport             from 'passport'
import { 
    captureSessionInfoMiddleware, 
    validateSession2FAStateMiddleware
}                           from '#middleware/session.middleware.js'
import { 
    syncCSRFSecretMiddleware,
}                           from '#middleware/csrf.middleware.js'
import { getPath }          from '#utils/path.util.js'
import { sendAuthRedirect } from '#responses/auth.response.js'

export const registerOAuthGoogleRoutes = (server) => {

  server.app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  server.app.get('/auth/google/register', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }))
  server.app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: getPath([process.env.CLIENT_ORIGIN, '/login']) }), 
    syncCSRFSecretMiddleware, 
    captureSessionInfoMiddleware, 
    validateSession2FAStateMiddleware, 
    sendAuthRedirect(process.env.CLIENT_ORIGIN))
}