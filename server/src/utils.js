import path                 from 'path'
import { fileURLToPath }    from 'url'
import { DBTableSchema }    from './table_schema.js'

export const rootPath     = path.dirname(fileURLToPath(import.meta.url))
export const cookieMaxAge = 365 * 24 * 60 * 60 * 1000

export const getUsersDatabaseTableSchema = () => {
    return new DBTableSchema([
        { name: 'id',       type: 'UUID NOT NULL PRIMARY KEY' },
        { name: 'username', type: 'TEXT' },
        { name: 'password', type: 'TEXT' }
    ])
}