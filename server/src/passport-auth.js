import bcrypt                            from 'bcrypt'
import passport                          from 'passport'
import { Strategy as LocalStrategy }     from 'passport-local'
import { Strategy as GoogleStrategy }    from 'passport-google-oauth20'

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
        
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            try {
                const user = await database.getUserByEmail(email, server)

                if (!user) {
                    return done(null, false, { message: `User by the email ${email} does not exists!` })
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

        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email        = profile.emails[0].value
                const profileID    = profile.id;
                const existingUser = await database.getUserByEmail(email);

                if (existingUser) {

                    existingUser.google_id = profileID

                    await database.updateUser(existingUser.id, 'google_id', profileID)

                    return done(null, existingUser);
                }
                const newUser = await database.createGoogleUser(email, profileID);

                return done(null, newUser);
            }
            catch (error) {
                return done(error)
            }
        }))
    }
}