import bcrypt                            from 'bcrypt'
import passport                          from 'passport'
import { Strategy as LocalStrategy }     from 'passport-local'
import { Strategy as GoogleStrategy }    from 'passport-google-oauth20'
import { Strategy as GitHubStrategy }    from 'passport-github2'
import { oauth_authentication }          from './auth.js'

export const passportStrategyCallback = (error, user, info, res, next) => {
    if (error) {
        return res.status(500).json({ error: error.message })
    }
    if (!user) {
        return res.status(info.status).json({ error: info.error })
    }
    return next()
}

export class PassportAuth {
    constructor(server) {
        this.server = server
    }
    initialize() {
        const server   = this.server
        const database = server.database

        server.app.use(passport.initialize())
        server.app.use(passport.session())

        passport.serializeUser((user, done) => {
            done(null, {
                userID: user.id,
                sessionID: user.sessionID
            })
        })
        
        passport.deserializeUser(async (obj, done) => {
            try {
                const user = await database.getUserById(obj.userID)

                if (user) {
                    user.sessionID = obj.sessionID
                    done(null, user)

                    return
                }
                done(null, false)
            } catch (error) {
                done(error)
            }
        })
        
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            try {
                const user = await database.getUserByEmail(email)

                if (!user) {
                    return done(null, false, { status: 404, error: `User by the email ${email} does not exists!` })
                }
                const userPassword = await database.getUserPassword(user.id)

                if (!userPassword) {
                    return done(null, false, { status: 400, error: `User by the email ${email} does not have a password!` })
                }
                const isValid = await bcrypt.compare(password + process.env.PEPPER_KEY, userPassword)
        
                if (!isValid) {
                    return done(null, false, { status: 401, error: 'Incorrect password.' })
                }
                return done(null, user)
            }
            catch (error) {
                return done(error)
            }
        }))

        const getGoogleProfile = (profile) => {
            return {
                username: profile.emails?.[0]?.value
            }
        }
        passport.use(new GoogleStrategy({
            clientID:           process.env.GOOGLE_CLIENT_ID,
            clientSecret:       process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:        "/auth/google/callback",
            passReqToCallback:  true
        },
        async (req, accessToken, refreshToken, profile, done) => 
            oauth_authentication(req, profile, done, this.server, "Google", getGoogleProfile)))

        const getGithubProfile = (profile) => {
            return {
                username: profile.username
            }
        }
        passport.use(new GitHubStrategy({
            clientID:           process.env.GITHUB_CLIENT_ID,
            clientSecret:       process.env.GITHUB_CLIENT_SECRET,
            callbackURL:        "/auth/github/callback",
            passReqToCallback:  true
        },
        async (req, accessToken, refreshToken, profile, done) => 
            oauth_authentication(req, profile, done, this.server, "Github", getGithubProfile)))
    }
}