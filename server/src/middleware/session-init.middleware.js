import session          from 'express-session'
import { cookieMaxAge } from '#utils/env.util.js'
import { isProduction } from '#utils/env.util.js'
import { database }     from '#services/database.service.js'
 
const SESSION_TABLE_NAME = 'session'

export const sessionInitMiddleware = (server) => session({
    //store:             new (connectRedis(session))({ client: server.RedisClient }),
    name:              'connect.sid',
    secret:            process.env.PASSPORT_SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: !isProduction(), 
        secure:   isProduction(),
        maxAge:   cookieMaxAge,
        sameSite: process.env.SAME_SITE // Default is 'lax'
    },
    store: new server.pgSessionStore({
        pool:                 database.pool,
        tableName:            SESSION_TABLE_NAME,
        createTableIfMissing: true
    })
})