import { generateRandomCode }                            from '#utils/random.util.js'
import pg                                                from 'pg';
import { logDevError, logDevMessage }                                   from './logger.js'
import { isAwaitableFunction, totalFuncParameterCount }  from '#utils/function.util.js'

export class Database { 

    constructor() {
        console.log('Port: ' + process.env.DB_PORT)

        this.id   = generateRandomCode()
        this.port = parseInt(process.env.DB_PORT)
        this.pool = new pg.Pool({
            user:     process.env.CLIENT_DB_USERNAME,
            password: process.env.CLIENT_DB_PASSWORD,
            database: process.env.DB_TB_NAME,
            port:     this.port
        })
    }
    query = async (text, params, log = true, connection = null, releaseClientAfter = true) => {
        let client = connection

        if (!client) {
            client = await this.#connectToAvailableClient()
        }
        if (!client) {
            throw new Error("Internal Database Error!");
        }
        try {
            return await client.query(text, params)
        } catch (error) {

            if (log) {
                logDevError('Database query', error.stack)
                throw error
            }

        } finally {
            if (!connection && releaseClientAfter) {
                client.release()
            }
        }
    }
    transaction = async (operation) => {
        const client = await this.#connectToAvailableClient()

        if (!client) {
            return false
        }
        try {
            await this.query('BEGIN', null, true, client, false)

            if (!isAwaitableFunction(operation)) {
                throw new Error("Provided 'operation' is not an async function or does not return a Promise.")
            }
            if (totalFuncParameterCount(operation) !== 1) {
                throw new Error("Provided 'operation' contains an invalid count of arguments.")
            }
            await operation(client)

            await this.query('COMMIT', null, true, client, false)

            return true
        } catch (error) {
            await this.query('ROLLBACK', null, true, client, false)

            logDevError('Error occurred during database transaction operation', error)
            return false
        } finally {
            if (client) client.release()
        }
    }
    update = async (table, setkey, setValue, whereKey, whereValue, client = null, releaseClientAfter = true) => {
        try {
            let command = `UPDATE ${table}`

            const { clause: setClause, queryParams: setQueryParams } = this.#formatSetClause(setkey, setValue) 
            command += setClause;
            
            const { clause: whereClause, queryParams: whereQueryParams } = this.#formatWhereClause(whereKey, whereValue, setQueryParams.length)
            command += whereClause;

            await this.query(command, [...setQueryParams, ...whereQueryParams], true, client, releaseClientAfter)
        }
        catch (error) {
            logDevError('Database update error', error.stack)
            throw error
        }
    }
    push = async (table, data, schema, client = null, releaseClientAfter = true) => {
        const schemaNames  = schema.getColumnNames()

        const entries      = Object.entries(data).filter(([key, _]) => schemaNames.includes(key))
        const keys         = entries.map(([key, _]) => key)
        const values       = entries.map(([_, value]) => value)

        const columns      = keys.join(', ')
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

        const command      = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`

        await this.query(command, values, true, client, releaseClientAfter)
    }
    fetch = async (values, schema, table, whereID, whereValue, client = null, releaseClientAfter = true) => {
        if (schema && !schema.validateNames(values)) {
            logDevError('Database fetch error. Trying to access undefined tables values!')
            return null
        }
        const keys   = Array.isArray(values) ? values.join(', ') : values
        let command  = `SELECT ${keys} FROM ${table}`

        const { clause: whereClause, queryParams } = this.#formatWhereClause(whereID, whereValue)
        command += whereClause

        return await this.query(command, queryParams, true, client, releaseClientAfter)
    }
    remove = async (table, whereID, whereValue, client = null, releaseClientAfter = true) => {
        let command = `DELETE FROM ${table}`

        const { clause: whereClause, queryParams } = this.#formatWhereClause(whereID, whereValue)
        command += whereClause

        return await this.query(command, queryParams, true, client, releaseClientAfter)
    }
    #formatWhereClause = (keys, values, indexOffset = 0) => {
        return this.#formatClause(keys, values, 'WHERE', ' AND ', indexOffset)
    }
    #formatSetClause = (keys, values, indexOffset = 0) => {
        return this.#formatClause(keys, values, 'SET', ', ', indexOffset)
    }
    #formatClause = (keys, values, head, join = ' AND ', indexOffset = 0) => {
        let clauses     = []
        let queryParams = []
    
        if (Array.isArray(keys) && Array.isArray(values)) {
            
            if (keys.length !== values.length) {

                throw new Error("Length of keys and values arrays must match.")
            }
            clauses = keys.map((id, index) => {

                queryParams.push(values[index])
                return `${id} = $${index + 1+indexOffset}`
            });
        } else {

            clauses.push(`${keys} = $${1+indexOffset}`)
            queryParams.push(values)
        }
        return {
            clause:      clauses.length > 0 ? ` ${head} ${clauses.join(join)}` : '',
            queryParams: queryParams
        }
    }
    validateDBTable = async (tableName, schema, client = null, releaseClientAfter = true) => {
        try {
            const sqlQuery = schema.getCreateTableSQL(tableName)
            await this.query(sqlQuery, [], false, client, releaseClientAfter)
    
        } catch (error) {
            
            logDevError('Database table validation error', error.stack)
            throw error
        }
    }
    #connectToAvailableClient = async () => {
        try {
            return await this.pool.connect()
        }
        catch (error) {

            logDevError('Database get client error', error.stack)
            throw error
        }
    }
}

export const database = new Database()