import { checkAuthMiddleware }        from '#middleware/auth.middleware.js'
import { getUserSessions }            from '#queries/user.session.queries.js'
import { getUserMetadata }            from '#queries/user.queries.js'

export const registerSessionRoutes = (server) => {

   server.app.get('/session', checkAuthMiddleware, async (req, res) => {
       return res.status(200).json({ sessionID: req.user.sessionID })
   })
   server.app.get('/sessions', checkAuthMiddleware, async (req, res) => {
       const sessions = await getUserSessions(req.user.id)
    
       return res.status(200).json({ 
        sessions: sessions, 
        user: {
           sessionID: req.user.sessionID
       }})
   })
   server.app.get('/session/user', checkAuthMiddleware, async (req, res) => {
       return res.status(200).json(await getUserMetadata(req.user.id))
   })
}