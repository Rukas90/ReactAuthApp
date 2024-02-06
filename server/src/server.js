import express                                          from 'express'
import http                                             from 'http'
import WebSocket, { WebSocketServer }                   from 'ws'
import { log }                                          from 'console'
import session                                          from 'express-session'
import connectPgSimple                                  from 'connect-pg-simple'
import cors                                             from 'cors'
import bodyParser                                       from 'body-parser'
import { Database }                                     from './database.js'
import { PassportAuth }                                 from './passport-auth.js'
import { Endpoints }                                    from './endpoints.js'
import { 
    cookieMaxAge, 
    getUsersDBTableSchema, 
    usersDBTable 
}                                                       from './utils.js'
import useragent                                        from 'express-useragent'
import { rateLimit }                                    from 'express-rate-limit'
import csrf                                             from 'csrf'
import cookieParser                                     from 'cookie-parser'

export class Server {

    constructor(port) {
        this.app            = express()
        this.port           = port
        this.database       = new Database(process.env.DB_TB_NAME, process.env.DB_PORT)
        
        this.database.validateDBTable(usersDBTable, getUsersDBTableSchema())
    
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
            origin: (origin, callback) => {
                if (!origin || origin === process.env.CLIENT_ORIGIN || origin === process.env.CLIENT_ORIGIN+'/') {
                    callback(null, true)
                    return
                }
                callback(new Error('Not allowed by CORS'))
            },                 // Allowed origins (TODO: Replace with a predefined origin list instead)
            credentials: true  // To allow sending of cookies with requests
        }))
        const limiter = rateLimit({
            windowMs:        15 * 60 * 1000,
            limit:           10000,
            standardHeaders: 'draft-7',
            legacyHeaders:   false,
        })
        this.app.use(limiter)

        // Content Security Policy (CSP) configuration ...

        this.app.use((_, res, next) => {
            res.setHeader(
              "Content-Security-Policy",
              `default-src 'self'; img-src 'self' ${process.env.CLIENT_ORIGIN}; script-src 'self' ${process.env.CLIENT_ORIGIN}; style-src 'self' ${process.env.CLIENT_ORIGIN};`
            )
            next()
        })

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
                return res.status(403).json({ error: "Session not found" })
            } 
            const csrfToken = this.tokens.create(req.session.csrfSecret)

            res
            .cookie('X-CSRF-Token', csrfToken, { httpOnly: true, sameSite: process.env.SAME_SITE })
            .json({ csrfToken: csrfToken })
        })
    }
    cSRFTokenVerification = (req, res, next) => {
        try {
            const token = req.headers['csrf-token']
    
            if (!req.session || !this.tokens.verify(req.session.csrfSecret, token)) {
                console.error("Invalid CSRF token")
                return res.status(400).json({ error: "Invalid CSRF token" })
                
            }
            next()
        }
        catch (error) {
            console.error("Error when validating a CSRF token:", error)
            return res.status(403).json({ error: error.message })
        }
    }
    syncCSRFSecretMiddleware = (req, res, next) => {
        if (!req.session) {
            return res.status(403).json({ error: "Session not found" })
        }
        this.syncCSRFSecret(req)
        next()
    }
    syncCSRFSecret = (req) => {
        if (req.session && req.session.csrfSecret) {
            return
        }
        const secret = this.tokens.secretSync()
        
        req.session.csrfSecret = secret
    }
    start() {
        try {
            const httpServer = http.createServer(this.app) // Use HTTPS in the release

            this.wss = new WebSocketServer({ server: httpServer })
            this.wss.on('connection', ws => {

                console.log('WebSocket client connected')

                ws.on('message', message => {
                    const data = JSON.parse(message)

                    if (data.type === 'identification') {

                        ws.userID = data.userID
                    }
                })
                ws.on('close', () => {
                    console.log('WebSocket client disconnected')
                })
            })
            httpServer.listen(this.port, '0.0.0.0', () => {
                log(`Server is running on port ${this.port}`)
            })
        }
        catch (error) {
            throw error
        }
    }
}