import { logDevMessage } from '#services/logger.js'
import cors from 'cors'

const normalizeOrigin = (origin) => origin?.replace(/\/+$/, '')

export const validateCorsMiddleware = () => {
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5173/',
        process.env.CLIENT_ORIGIN,
        process.env.CLIENT_ORIGIN + '/',
    ]
    const allowedHeaders = [
        'X-CSRF-Token', 
        'auth-token', 
        'Content-Type'
    ]
    return cors({
        origin: (origin, callback) => {

            const nOrigin   = normalizeOrigin(origin)
            const isAllowed = !origin || allowedOrigins.includes(nOrigin)

            logDevMessage("Incoming request origin:", nOrigin || "[no origin header]")
            
            if (isAllowed) {
                callback(null, true)
            }
            else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        allowedHeaders: allowedHeaders,
        credentials: true  // To allow sending of cookies with requests
    })
}