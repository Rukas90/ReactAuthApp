import { 
    checkAuthMiddleware,
} from '#middleware/auth.middleware.js'
import { 
    oauthIdentify
} from '#controllers/oauth.controller.js'
import { 
    verifyCsrfTokenMiddleware
} from '#middleware/csrf.middleware.js'
import { getOAuthProviders } from '#queries/oauth.queries.js'

export const registerOAuthProvidersRoutes = (server) => {

   server.app.get('/oauth/providers', checkAuthMiddleware, async (req, res) => {
       return res.status(200).json({ providers: await getOAuthProviders(req.user.id, ['id', 'provider_name', 'profile']) })
   })
   server.app.post('/oauth/identify', verifyCsrfTokenMiddleware, async (req, res) => {
       if (!req.session.pendingOAuth) {
           return res.status(400)
       }
       return await oauthIdentify(req, res)
   })

}