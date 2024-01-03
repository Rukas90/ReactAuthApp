import express                                          from 'express'
import { log, error }                                   from 'console'
import session                                          from 'express-session'
import connectPgSimple                                  from 'connect-pg-simple'
import cors                                             from 'cors'
import bodyParser                                       from 'body-parser'
import { Database }                                     from './database.js'
import { PassportAuth }                                 from './passport-auth.js'
import { Endpoints }                                    from './endpoints.js'
import { cookieMaxAge, getUsersDatabaseTableSchema }    from './utils.js'

export class Server {

    constructor(port) {
        this.app            = express()
        this.port           = port
        this.database       = new Database(process.env.DB_TB_NAME, process.env.DB_PORT)
        
        this.database.validateDBTable('users', getUsersDatabaseTableSchema())

        this.pgSessionStore = connectPgSimple(session)
        
        this.#setupMiddleware()

        this.passportAuth   = new PassportAuth(this)
        this.passportAuth.initialize()

        this.endpoints      = new Endpoints(this)
    }
    #setupMiddleware() {
        this.app.use(cors({
            origin: 'http://localhost:5173' // Client side URL
        }))
        this.app.use(express.static('public'))
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(session({
            secret:            process.env.PASSPORT_SESSION_SECRET,
            resave:            false,
            saveUninitialized: false,
            cookie:            { 
                secure: false, 
                maxAge: cookieMaxAge 
            },
            store:             new this.pgSessionStore({
                pool:                 this.database.pool,
                tableName:            'session',
                createTableIfMissing: true
            })
        }))
    }
    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            log(`Server is running on port ${this.port}`)
        })
    }
}