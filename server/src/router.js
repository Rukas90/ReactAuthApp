import passport                     from 'passport'
import { log, error }               from 'console'
import bcrypt                       from 'bcrypt'
import { validateAuthentication }   from './middlewares.js'

export class Router {
    constructor(server) {
        this.server = server

        this.#initialize()
    }
    #initialize() {
        this.server.app.get('/', (_, res) => {
            res.render('home.ejs')
        })
        this.server.app.get('/login', (_, res) => {
            res.render('login.ejs')
        })
        this.server.app.get('/register', (_, res) => {
            res.render('register.ejs')
        })
        this.server.app.get('/logout', (req, res) => {
            req.logout(function(error) {
                if (error) { return next(error); }

                res.redirect('/')
            })
        })
        this.server.app.get('/secrets', validateAuthentication, (_, res) => {
            res.render('secrets.ejs')
        })

        this.server.app.post('/register', async (req, res) => {
            const { username, password } = req.body

            const database = this.server.database
        
            try {
                const user = await database.query('SELECT * FROM users WHERE username = $1', [username])
        
                if (user.rowCount > 0) {
                    return res.status(409).send('User already exists')
                }
                const salt           = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password + process.env.PEPPER_KEY, salt)
        
                const newUser = await database.createUser(username, hashedPassword)
                        
                req.login(newUser, (err) => {
                    if (err) {
                        return res.status(500).send('Error establishing a login session')
                    }
                    return res.redirect('/secrets')
                })
            } catch (err) {
                error('Error during registration:', err)
                res.status(500).send('Internal Server Error')
            }
        })
        this.server.app.post('/login', passport.authenticate('local', {
            successRedirect: '/secrets',
            failureRedirect: '/login',
            failureFlash: false
        }))
    }
}