import { 
    checkAuthMiddleware,
} from '#middleware/auth.middleware.js'
import { 
    updateUserPassword, 
    verifyUserPassword,
    deleteUserAccount
} from '#controllers/user.controller.js'
import { 
    verifyCsrfTokenMiddleware
} from '#middleware/csrf.middleware.js'
import { 
    checkSessionBlockedMiddleware 
} from '#middleware/session-blocked.middleware.js'

export const registerUserRoutes = (server) => {

   server.app.post('/user/password/verify', verifyCsrfTokenMiddleware, checkAuthMiddleware, checkSessionBlockedMiddleware, 
    async (req, res) => await verifyUserPassword(req, res))
    
   server.app.post('/user/password/update', verifyCsrfTokenMiddleware, checkAuthMiddleware, checkSessionBlockedMiddleware, 
    async (req, res) => await updateUserPassword(req, res))

   server.app.delete('/user', verifyCsrfTokenMiddleware, checkAuthMiddleware, checkSessionBlockedMiddleware, 
    async (req, res) => {
       return await deleteUserAccount(req, res)
   })

}