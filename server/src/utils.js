import path                 from 'path'
import { fileURLToPath }    from 'url'
import { DBTableSchema }    from './db-table-schema.js'
import crypto               from 'crypto'

export const rootPath     = path.dirname(fileURLToPath(import.meta.url))
export const cookieMaxAge = 365 * 24 * 60 * 60 * 1000

// Database table names

export const usersDBTable               = 'users'
export const sessionsDBTable            = 'sessions'
export const oAuthProviderDBTable       = 'oauth_providers'
export const blockedSessionsDBTable     = 'blocked_sessions'

// Database table schemas

export const getUsersDBTableSchema = () => {
    return new DBTableSchema([
        { name: 'id',                 type: 'UUID NOT NULL PRIMARY KEY' },
        { name: 'email',              type: 'TEXT' },
        { name: 'password',           type: 'TEXT' },
        { name: 'is_verified',        type: 'BOOLEAN DEFAULT FALSE' },
        { name: 'date',               type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
        { name: 'verification_code',  type: 'VARCHAR' },
        { name: 'code_expire_date' ,  type: 'TIMESTAMP WITH TIME ZONE' },
        { name: 'two_fa_secret',      type: 'TEXT' },
        { name: 'two_fa_active',      type: 'BOOLEAN DEFAULT FALSE' }
    ])
}
export const getSessionsDBTableSchema = () => {
    return new DBTableSchema([
        { name: 'session_id',           type: 'UUID NOT NULL PRIMARY KEY' },
        { name: 'user_id',              type: 'UUID REFERENCES users(id)' },
        { name: 'ip_address',           type: 'TEXT' },
        { name: 'device_type',          type: 'TEXT' },
        { name: 'location',             type: 'TEXT' },
        { name: 'login_time',           type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
        { name: 'last_activity_time' ,  type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
        { name: 'source',               type: 'TEXT' }
    ])
}
export const getOAuthProvidersDBTableSchema = () => {
    return new DBTableSchema([
        { name: 'id',                   type: 'UUID NOT NULL PRIMARY KEY' },
        { name: 'user_id',              type: 'UUID REFERENCES users(id)' },
        { name: 'provider_name',        type: 'TEXT' },
        { name: 'provider_id',          type: 'TEXT' },
        { name: 'profile',              type: 'JSON' },
    ])
}
export const getBlockedSessionsDBTableSchema = () => {
    return new DBTableSchema([
        { name: 'session_id',           type: 'UUID REFERENCES sessions(session_id)' },
        { name: 'block_reason',         type: 'VARCHAR(255)' },
        { name: 'block_start_time',     type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
        { name: 'block_duration',       type: `INTERVAL DEFAULT '24 hours'` },
        { name: 'block_end_time',       type: 'TIMESTAMP WITH TIME ZONE' },
    ])
}

export const generateRandomCode = (length = 6, hasLetters = false) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    const palette      = hasLetters ? letters + numbers : numbers    
    const randomValues = crypto.randomBytes(length)

    let code = ''

    for (let i = 0; i < length; i++) {
        code += palette.charAt(randomValues[i] % palette.length)
    }
    return code
}

/**
 * Constructs a URL from path segments and query parameters.
 *
 * @param {string[]} pathSegments - An array of path segments.
 * @param {Object[]} queryParams - An array of objects with 'name' and 'value' properties for query parameters.
 * @returns {string} The formatted URL.
 */
export const getPath = (pathSegments, queryParams = null) => {
    const path = pathSegments.join('/').replace(/\/+/g, '/').replace(/\/$/, '')
    const url  = new URL(path)

    if (queryParams) {
        const params = new URLSearchParams()

        queryParams.forEach(param => {
            params.append(param.name, param.value)
        })
        url.search = params.toString()
    }
    return url.toString()
}

export const isAwaitableFunction = (func) => {
    return typeof func === 'function' && func.constructor.name === "AsyncFunction"
}
export const totalFuncParameterCount = (func) => {
    return func.length
}

/**
 * Validates whether the user is authenticated and exists.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object for sending error messages.
 * @returns {boolean} True if the user is authenticated and exists, false otherwise.
*/
export const userSessionValidation = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({
            message: "User is not logged in" 
        })
        return false
    }
    const user = req.user;

    if (!user) {
        res.status(404).json({ 
            error: "User is not found!"
        })
        return false
    }
    return true
}