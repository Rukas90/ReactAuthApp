import express                                          from 'express'
import { log }                                          from 'console'
import session                                          from 'express-session'
import connectPgSimple                                  from 'connect-pg-simple'
import cors                                             from 'cors'
import bodyParser                                       from 'body-parser'
import { Database }                                     from './database.js'
import { PassportAuth }                                 from './passport-auth.js'
import { Endpoints }                                    from './endpoints.js'
import { cookieMaxAge, getUsersDatabaseTableSchema }    from './utils.js'
import useragent                                        from 'express-useragent'
import { rateLimit }                                    from 'express-rate-limit'
import csrf                                             from 'csrf'
import cookieParser                                     from 'cookie-parser'

export class Server {

    constructor(port) {
        this.app            = express()
        this.port           = port
        this.database       = new Database(process.env.DB_TB_NAME, process.env.DB_PORT)
        
        this.database.validateDBTable('users', getUsersDatabaseTableSchema())

        // Attach the database instance
        this.app.locals.database = this.database

        this.pgSessionStore = connectPgSimple(session)
        
        this.tokens = new csrf()

        this.#setupMiddleware()

        this.passportAuth = new PassportAuth(this)
        this.passportAuth.initialize()

        this.endpoints    = new Endpoints(this)
    }
    #setupMiddleware() {
        this.app.use(cors({
            origin:      process.env.CLIENT_ORIGIN, // Client side URL
            credentials: true                       // To allow sending of cookies with requests
        }))
        const limiter = rateLimit({
            windowMs:        15 * 60 * 1000,
            limit:           100,
            standardHeaders: 'draft-7',
            legacyHeaders:   false,
        })
        this.app.use(limiter)

        this.app.use(express.static('public'))
        this.app.use(express.json())
        this.app.use(useragent.express())

        this.app.use(cookieParser())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        
        this.app.use(session({
            secret:            process.env.PASSPORT_SESSION_SECRET,
            resave:            false,
            saveUninitialized: false,
            cookie:            { 
                secure:   false, // Needs to be set to true when in release
                httpOnly: true, 
                maxAge:   cookieMaxAge 
            },
            store:             new this.pgSessionStore({
                pool:                 this.database.pool,
                tableName:            'session',
                createTableIfMissing: true
            })
        }))
        this.app.get('/session/token', this.syncCSRFSecretMiddleware, (req, res) => {
            if (!req.session) {
                return res.status(403).send("Session not found")
            } 
            const csrfToken = this.tokens.create(req.session.csrfSecret)

            res
            .cookie('X-CSRF-Token', csrfToken, { httpOnly: true, sameSite: 'Lax' })
            .json({ csrfToken: csrfToken })
        })
    }
    cSRFTokenVerification = (req, res, next) => {
        try {
            const token = req.headers['csrf-token']
    
            if (!req.session || !this.tokens.verify(req.session.csrfSecret, token)) {
                throw new Error("Invalid CSRF token")
            }
            next()
        }
        catch (error) {
            return res.status(403).send(error.message)
        }
    }
    syncCSRFSecretMiddleware = (req, res, next) => {
        if (!req.session) {
            return res.status(403).send("Session not found")
        }
        this.syncCSRFSecret(req)
        next()
    }
    syncCSRFSecret = (req) => {
        if (req.session.csrfSecret) {
            return
        }
        const secret = this.tokens.secretSync()
        
        req.session.csrfSecret = secret
    }
    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            log(`Server is running on port ${this.port}`)
        })
    }
}