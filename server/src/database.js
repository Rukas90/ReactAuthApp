import pg                   from 'pg';
import { User }             from './user.js'
import { error as cserror } from 'console'

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
    getUserById = async (id) => {
        try {
            const result = await this.query('SELECT * FROM users WHERE id = $1', [id])

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {

            cserror('Database get user by id error', error.stack)
            throw error
        }
    }
    getUserByUsername = async (username) => {
        try {
            const result = await this.query('SELECT * FROM users WHERE username = $1', [username])

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {

            cserror('Database get user by username error', error.stack)
            throw error
        }
    }
    createUser = async (username, password) => {
        try {
            const newUser = User.createUniqueUser(username, password)
        
            await query('INSERT INTO users (id, username, password) VALUES ($1, $2, $3)', [newUser.id, username, password])
    
            return newUser
        }
        catch (error) {

            cserror('Database create user error', error.stack)
            throw error
        }
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
            const sqlQuery = schema.getCreateTableSQL(tableName);
        
            await this.query(sqlQuery, [], false)
    
        } catch (error) {
            
            cserror('Database table validation error', error.stack)
            throw error
        }
    }
}