import path                 from 'path'
import { fileURLToPath }    from 'url'
import { DBTableSchema }    from './db-table-schema.js'

export const rootPath     = path.dirname(fileURLToPath(import.meta.url))
export const cookieMaxAge = 365 * 24 * 60 * 60 * 1000

export const getUsersDatabaseTableSchema = () => {
    return new DBTableSchema([
        { name: 'id',                 type: 'UUID NOT NULL PRIMARY KEY' },
        { name: 'email',              type: 'TEXT' },
        { name: 'password',           type: 'TEXT' },
        { name: 'is_verified',        type: 'BOOLEAN DEFAULT FALSE' },
        { name: 'date',               type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
        { name: 'verification_code',  type: 'VARCHAR' },
        { name: 'code_expire_date' ,  type: 'TIMESTAMP WITH TIME ZONE' },
        { name: 'google_id',          type: 'TEXT' },
        { name: 'twitter_id',         type: 'TEXT' },
        { name: 'two_fa_secret',      type: 'TEXT' },
        { name: 'two_fa_active',      type: 'BOOLEAN DEFAULT FALSE' }
    ])
}
export const getSessionsDatabaseTableSchema = () => {
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

export const generateRandomCode = (length = 6) => {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10).toString(); // Add a random digit (0-9) as a string
    }
    return code;
}