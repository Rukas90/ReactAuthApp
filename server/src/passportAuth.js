import bcrypt                         from 'bcrypt'
import passport                       from 'passport'
import { Strategy as LocalStrategy }  from 'passport-local'

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
            done(null, user.id)
        });
        
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await database.getUserById(id, server)

                done(null, user)
            } catch (error) {
                done(error)
            }
        });
        
        passport.use(new LocalStrategy(async (username, password, done) => {
            try {
                const user = await database.getUserByUsername(username, server)

                if (!user) {
                    return done(null, false, { message: `User by the username ${username} does not exists!` })
                }
                const isValid = await bcrypt.compare(password + process.env.PEPPER_KEY, user.password)
        
                if (!isValid) {
                    return done(null, false, { message: 'Incorrect password.' })
                }
                return done(null, user)
            }
            catch (error) {
                return done(error)
            }
        }))
    }
}