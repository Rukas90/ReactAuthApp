import pg                               from 'pg';
import { error as cserror }             from 'console'
import { getUsersDatabaseTableSchema }  from './utils.js'
import { v4 as uuidv4 }                 from 'uuid'
import { generateRandomCode }           from './utils.js'

export class Database {
    constructor(name, port) {
        this.port = parseInt(port)
        this.pool = new pg.Pool({
            user:     process.env.CLIENT_DB_USERNAME,
            password: process.env.CLIENT_DB_PASSWORD,
            database: name,
            port:     port
        })
    }
    query = async (text, params, log = true) => {
        const client = await this.#connectToAvailableClient()

        try {
            return await client.query(text, params)
        } catch (error) {

            if (log) {
                cserror('Database query error', error.stack)
                throw error
            }

        } finally {
            client.release()
        }
    }
    updateUser = async (id, property, value) => {
        try {
            const query = `UPDATE users SET ${property} = $1 WHERE id = $2`
            await this.query(query, [value, id])
        }
        catch (error) {
            console.error('Database update user error', error.stack)
            throw error;
        }
    };
    getUserById = async (id) => {
        try {
            const result = await this.query('SELECT id, email, is_verified, two_fa_active FROM users WHERE id = $1', [id])

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {

            cserror('Database get user by id error', error.stack)
            throw error
        }
    }
    getUserByEmail = async (email) => {
        try {
            const result = await this.query('SELECT id, email, is_verified, two_fa_active FROM users WHERE email = $1', [email])

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {

            cserror('Database get user by email error', error.stack)
            throw error
        }
    }
    getUserPassword = async (id) => {
        try {
            const result = await this.query('SELECT password FROM users WHERE id = $1', [id])

            return result.rowCount <= 0 ? null : result.rows[0].password
        }
        catch (error) {

            cserror('Database get user password error', error.stack)
            throw error
        }
    }
    createUser = async (email, password) => {
        try {
            let newUser      = this.getNewUser(email)
            newUser.password = password

            await this.push('users', newUser, getUsersDatabaseTableSchema())
    
            return newUser
        }
        catch (error) {

            cserror('Database create user error', error.stack)
            throw error
        }
    }
    createGoogleUser = async (email, id) => {
        try {
            let newUser = this.getNewUser(email)

            newUser.is_verified = true
            newUser.google_id   = id

            await this.push('users', newUser, getUsersDatabaseTableSchema())

            return newUser
        }
        catch (error) {

            cserror('Database create user error', error.stack)
            throw error
        }
    }
    getNewUser(email) {
        const userID         = uuidv4()
        const codeExpireDate = new Date()
        codeExpireDate.setHours(codeExpireDate.getHours() + 24)

        return {
            id: userID,
            email: email,
            is_verified: false,
            verification_code: generateRandomCode(),
            date: new Date().toISOString(),
            code_expire_date: codeExpireDate.toISOString()
        }
    }
    push = async (table, data, schema) => {
        const schemaNames    = schema.getColumnNames()

        const entries      = Object.entries(data).filter(([key, _]) => schemaNames.includes(key))
        const keys         = entries.map(([key, _]) => key)
        const values       = entries.map(([_, value]) => value)

        const columns = keys.join(', ')
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

        const command = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`

        await this.query(command, values)
    }
    fetch = async (values, table, whereID, whereValue) => {
        const keys = Array.isArray(values) ? values.join(', ') : values
        const command = `SELECT ${keys} FROM ${table} WHERE ${whereID} = $1`

        return await this.query(command, [whereValue])
    }
    #connectToAvailableClient = async () => {
        try {
            return await this.pool.connect()
        }
        catch (error) {

            cserror('Database get client error', error.stack)
            throw error
        }
    }
    validateDBTable = async (tableName, schema) => {
        try {
            const sqlQuery = schema.getCreateTableSQL(tableName)
        
            await this.query(sqlQuery, [], false)
    
        } catch (error) {
            
            cserror('Database table validation error', error.stack)
            throw error
        }
    }
}