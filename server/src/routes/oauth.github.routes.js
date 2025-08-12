
import passport             from 'passport'
import { 
    captureSessionInfoMiddleware, 
    validateSession2FAStateMiddleware
}                           from '#middleware/session.middleware.js'
import { 
    syncCSRFSecretMiddleware,
}                           from '#middleware/csrf.middleware.js'
import { getPath }          from '#utils/path.util.js'
import { sendAuthResponse } from '#responses/auth.response.js'

export const registerOAuthGithubRoutes = (server) => {

  server.app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
  server.app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: getPath([process.env.CLIENT_ORIGIN, '/login']) }), 
    syncCSRFSecretMiddleware, 
    captureSessionInfoMiddleware, 
    validateSession2FAStateMiddleware,
    sendAuthResponse('Authentication successful'))
}