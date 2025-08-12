import { register2FARoutes }            from '#routes/auth.2fa.routes.js'
import { registerAuthRoutes }           from '#routes/auth.routes.js'
import { registerOAuthGithubRoutes }    from '#routes/oauth.github.routes.js'
import { registerOAuthGoogleRoutes }    from '#routes/oauth.google.routes.js'
import { registerOAuthProvidersRoutes } from '#routes/oauth.provides.routes.js'
import { registerSessionRoutes }        from '#routes/session.routes.js'
import { registerUserRoutes }           from '#routes/user.routes.js'
import { registerVerificationRoutes }   from '#routes/verification.routes.js'

export function setupRoutes(server) {
    
  register2FARoutes(server)
  registerAuthRoutes(server)
  registerOAuthGithubRoutes(server)
  registerOAuthGoogleRoutes(server)
  registerOAuthProvidersRoutes(server)
  registerSessionRoutes(server)
  registerUserRoutes(server)
  registerVerificationRoutes(server)
}