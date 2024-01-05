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
    updateUser = async (id, property, value) => {
        try {
            const query = `UPDATE users SET ${property} = $1 WHERE id = $2`;
            await this.query(query, [value, id]);
        }
        catch (error) {
            console.error('Database update user error', error.stack);
            throw error;
        }
    };
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
    getUserByEmail = async (email) => {
        try {
            const result = await this.query('SELECT * FROM users WHERE email = $1', [email])

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {

            cserror('Database get user by email error', error.stack)
            throw error
        }
    }
    createUser = async (email, password) => {
        try {
            const newUser = new User(null, email, password)
        
            await this.query('INSERT INTO users (id, email, password, is_verified, date, verification_code, code_expire_date) VALUES ($1, $2, $3, $4, $5, $6, $7)', [newUser.id, email, password, newUser.is_verified, newUser.date, newUser.verification_code, newUser.code_expire_date])
    
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