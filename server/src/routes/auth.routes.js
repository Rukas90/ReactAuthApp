import { 
    captureSessionInfoMiddleware, 
    validateSession2FAStateMiddleware
}                                 from '#middleware/session.middleware.js'
import { 
    syncCSRFSecretMiddleware,
}                                 from '#middleware/csrf.middleware.js'
import { 
    validateHCaptchaTokenMiddleware 
}                                 from '#middleware/captcha.middleware.js'
import { 
  loginLocalMiddleware,
  logoutUserMiddleware, 
  registerUserMiddleware 
}                                 from '#middleware/auth.middleware.js'
import { sendAuthRedirect, sendAuthResponse }       from '#responses/auth.response.js'
import { getAuthStatus }          from '#controllers/auth.controller.js'

export const registerAuthRoutes = (server) => {

  server.app.get('/auth/status', 
    (req, res) => getAuthStatus(req, res))

  server.app.post('/auth/register', 
    validateHCaptchaTokenMiddleware, 
    registerUserMiddleware, 
    loginLocalMiddleware, 
    syncCSRFSecretMiddleware, 
    captureSessionInfoMiddleware, 
    sendAuthResponse('User registered successfully'))

  server.app.post('/auth/login', 
      validateHCaptchaTokenMiddleware, 
      loginLocalMiddleware,
      syncCSRFSecretMiddleware,
      captureSessionInfoMiddleware,
      validateSession2FAStateMiddleware,
      sendAuthResponse('Authentication successful'))

  server.app.post('/auth/logout', 
    logoutUserMiddleware, 
    syncCSRFSecretMiddleware, 
    sendAuthRedirect(process.env.CLIENT_ORIGIN))
}