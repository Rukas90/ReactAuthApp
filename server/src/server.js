import express                      from 'express'
import passport                     from 'passport'
import http                         from 'http'
import { WebSocketServer }          from 'ws'
import session                      from 'express-session'
import connectPgSimple              from 'connect-pg-simple'
import { validateCorsMiddleware }   from '#middleware/cors.middleware.js'
import { limitRateMiddleware }      from '#middleware/rate-limit.middleware.js'
import { getCspConfigMiddleware }   from '#middleware/csp.middleware.js'
import { sessionInitMiddleware }    from '#middleware/session-init.middleware.js'
import { setupPassport }            from '#setup/passport.setup.js'
import { setupRoutes }              from '#setup/routes.setup.js'
import { logDevMessage }            from '#services/logger.js'
import useragent                    from 'express-useragent'
import bodyParser                   from 'body-parser'
import csrf                         from 'csrf'
import cookieParser                 from 'cookie-parser'
import { createRedisClient }        from '#services/redis.service.js'
import { initializeDatabaseTables } from '#config/db.table.init.js'

export class Server {

    constructor(port) {
        this.app            = express()
        this.port           = port
        //this.redisClient    = createRedisClient(true)
        this.pgSessionStore = connectPgSimple(session)
        
        this.app.locals.csrfTokens = new csrf()

        this.#setupMiddleware()

        setupPassport()
    }
    #setupMiddleware = () => {
        this.app.use(validateCorsMiddleware())
        this.app.use(limitRateMiddleware())
        this.app.use(getCspConfigMiddleware())
        this.app.use(sessionInitMiddleware(this))

        this.app.use(passport.initialize())
        this.app.use(passport.session())

        this.app.use(express.static('public'))
        this.app.use(express.json())
        this.app.use(useragent.express())

        this.app.use(cookieParser())
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }
    initialize = async () => {
        setupRoutes(this)
        await initializeDatabaseTables()
    }
    start = () => {
        const httpServer = http.createServer(this.app) // Use HTTPS in the release

        this.wss = new WebSocketServer({ server: httpServer })
        this.wss.on('connection', ws => {

            logDevMessage('WebSocket client connected')

            ws.on('message', message => {
                const data = JSON.parse(message)

                if (data.type === 'identification') {

                    ws.userID = data.userID
                }
            })
            ws.on('close', () => {
                logDevMessage('WebSocket client disconnected')
            })
        })
        httpServer.listen(this.port, '0.0.0.0', () => {
            logDevMessage(`Server is running on port ${this.port}`)
        })
    }
}