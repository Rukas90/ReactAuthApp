import { isUserAuthenticated }        from "#validators/user.validator.js"
import { hashValue }                  from '#utils/security.js'
import { createUser, getUserByEmail } from '#queries/user.queries.js'
import { logDevError }                from '#services/logger.js'
import passport                       from "passport"
import promisify from "util.promisify"

export const loginLocalMiddleware = (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
          return res.status(500).json({ error: 'Internal server error' })
        }
        if (!user) {
          return res
            .status(info?.status || 401)
            .json({ error: info?.error || 'Authentication failed' })
        }
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Login failed' })
          }
          next()
        })
    })(req, res, next)
}
export const checkAuthMiddleware = (req, res, next) => {
    if (!isUserAuthenticated(req)) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    if (!req.user) {
        return res.status(404).json({ error: "User is not found!" })
    }
    return next()
}
export const registerUserMiddleware = async (req, res, next) => {
    const email    = req.body.email 
    const password = req.body.password

    try {
        const user = await getUserByEmail(email)

        if (user !== null) {
            return res.status(409).json({ error: 'User already exists' })
        }
        const hashedPassword = await hashValue(password)
        await createUser(email, hashedPassword)        

        req.session.AuthentificationState = 3
        req.session.save()

        next()
           
    } catch (error) { 
        logDevError('Error (register_user):', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
export const logoutUserMiddleware = async (req, res, next) => {
    try {
        const logout = promisify(req.logout).bind(req)

        await logout()

        if (req.session) {
            delete req.session.passport
        }
        next()
    }
    catch (error) {
        logDevError("Error (log_out_user):", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}