import pg                               from 'pg';
import { error as cserror }             from 'console'
import { 
    isAwaitableFunction, 
    getOAuthProvidersDBTableSchema, 
    getUsersDBTableSchema,
    totalFuncParameterCount, 
    usersDBTable, 
    sessionsDBTable,
    oAuthProviderDBTable,
    blockedSessionsDBTable
}                                       from './utils.js'
import { v4 as uuidv4 }                 from 'uuid'
import { generateRandomCode }           from './utils.js'
import geoip                            from 'geoip-lite'
import { DBTableSchema }                from './db-table-schema.js';

/**
 * Database class to handle database operations.
 * 
 * This class abstracts the interactions with a PostgreSQL database using the 'pg' module.
 * It provides methods for querying, updating, and managing data related to users, sessions, and OAuth providers.
*/
export class Database {

    /**
     * Constructs the Database object and initializes the PostgreSQL connection pool.
     * 
     * @param {string} name - The name of the database.
     * @param {string|number} port - The port number of the database server.
    */
    constructor(name, port) {
        this.port = parseInt(port)
        this.pool = new pg.Pool({
            user:     process.env.CLIENT_DB_USERNAME,
            password: process.env.CLIENT_DB_PASSWORD,
            database: name,
            port:     port
        })
    }

    /** 
     * Executes a database query.
     * 
     * @param {string} text - The SQL query text.
     * @param {Array} params - The parameters for the SQL query.
     * @param {boolean} log - Flag to enable logging errors to console.
     * @param {pg.PoolClient} connection - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<object>} A promise that resolves with the query result.
    */
    query = async (text, params, log = true, connection = null, releaseClientAfter = true) => {
        const client = connection ?? await this.#connectToAvailableClient()

        try {
            return await client.query(text, params)
        } catch (error) {

            if (log) {
                cserror('Database query error', error.stack)
                throw error
            }

        } finally {
            if (!connection && releaseClientAfter) {
                client.release()
            }
        }
    }

    getBlockedSession = async (sessionID, client = null, releaseClientAfter = true) => {
        try {
            const result = await this.fetch('*', blockedSessionsDBTable, 'session_id', sessionID, client, releaseClientAfter)
            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {
            cserror('Database get blocked session error', error.stack)
            throw error
        }
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param {string} id - The user's ID.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<object|null>} The user data, or null if not found.
    */
    getUserById = async (id, client = null, releaseClientAfter = true) => {
        try {
            const result = await this.query('SELECT id, email, is_verified, two_fa_active FROM users WHERE id = $1', 
                [id], true, client, releaseClientAfter)

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {
            cserror('Database get user by id error', error.stack)
            throw error
        }
    }
    /**
     * Retrieves a user by their email address.
     * 
     * @param {string} email - The email address of the user.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<object|null>} The user data, or null if not found.
    */
    getUserByEmail = async (email, client = null, releaseClientAfter = true) => {
        try {
            const result = await this.query('SELECT id, email, is_verified, two_fa_active FROM users WHERE email = $1', 
                [email], true, client, releaseClientAfter)

            return result.rowCount <= 0 ? null : result.rows[0]
        }
        catch (error) {

            cserror('Database get user by email error', error.stack)
            throw error
        }
    }
    getUserMetadata = async (id) => {
        const password = await this.getUserPassword(id)

        return {
            userID:      id,
            hasPassword: password !== null && password !== undefined,
        }
    }

    /**
     * Retrieves the hashed password for a given user ID.
     * 
     * @param {string} id - The user's ID.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<string|null>} The hashed password, or null if not found.
    */
    getUserPassword = async (id, client = null, releaseClientAfter = true) => {
        try {
            const result = await this.query('SELECT password FROM users WHERE id = $1', 
                [id], true, client, releaseClientAfter)

            return result.rowCount <= 0 ? null : result.rows[0].password
        }
        catch (error) {

            cserror('Database get user password error', error.stack)
            throw error
        }
    }
    /**
     * Creates a new user in the database.
     * 
     * @param {string} email - The email address of the new user.
     * @param {string} password - The hashed password for the new user.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<object>} The newly created user object.
    */
    createUser = async (email, password, client = null, releaseClientAfter = true) => {
        try {
            let newUser      = this.getNewUser(email)
            newUser.password = password

            await this.push(usersDBTable, newUser, getUsersDBTableSchema(), client, releaseClientAfter)
    
            return newUser
        }
        catch (error) {

            cserror('Database create user error', error.stack)
            throw error
        }
    }
    /**
     * Creates a new user linked to an OAuth provider.
     * 
     * @param {string} email - The email address of the new user.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<object>} The newly created user object.
    */
    createLinkedNewUser = async (email, client = null, releaseClientAfter = true) => {
        try {
            let newUser = this.getNewUser(email)

            newUser.is_verified = true

            await this.push(usersDBTable, newUser, getUsersDBTableSchema(), client, releaseClientAfter)

            return newUser
        }
        catch (error) {

            cserror('Database create user error', error.stack)
            throw error
        }
    }
    /**
     * Validates if the provided OAuth provider is linked to the given user ID.
     * 
     * @param {string} userID - The user's ID.
     * @param {string} providerName - The name of the OAuth provider.
     * @param {string} providerID - The provider-specific user ID.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<boolean>} True if the provider is linked to the user, false otherwise.
    */
    validateOAuthProvider = async (userID, providerName, providerID, profileData, client = null, releaseClientAfter = true) => {
        try {
            const response = await this.fetch(
                ['id', 'provider_id', 'profile'], 
                oAuthProviderDBTable, 
                ['user_id', 'provider_name'], [userID, providerName]
            )
            const newProfileData = JSON.stringify(profileData)

            if (response && response.rowCount > 0) {

                if (JSON.stringify(response.profile) !== newProfileData) {
                    await this.update(oAuthProviderDBTable, 'id', response.rows[0].id, 'profile', newProfileData)
                }
                return response.rows[0].provider_id === providerID
            }
            if (!userID || !providerName || !providerID) {
                return false
            }
            const newProviderData = {
                id:            uuidv4(),
                user_id:       userID,
                provider_name: providerName,
                provider_id:   providerID,
                profile:       newProfileData
            }
            await this.push(oAuthProviderDBTable, newProviderData, getOAuthProvidersDBTableSchema(), client, releaseClientAfter)
                
            return true
        }
        catch (error) {

            cserror('Database validate oauth provider error', error.stack)
            throw error
        }
    }
    /**
     * Retrieves all sessions associated with a given user ID.
     * 
     * @param {string} id - The user's ID.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<Array>} An array of session objects, each enriched with geolocation information.
    */
    getUserSessions = async (id, client = null, releaseClientAfter = true) => {
        
        const data = await this.fetch('*', sessionsDBTable, 'user_id', id, client, releaseClientAfter)

        if (!data || data.rowCount < 1) {
            return null
        }
        const sessions = data.rows.map(session => {
            const geo = geoip.lookup(session.ip_address);
            return {
                ...session,
                geo: geo ? { latitude: geo.ll[0], longitude: geo.ll[1] } : null
            };
        });
        return sessions
    }

    getOAuthProviders = async (id, client = null, releaseClientAfter = true) => {

        const data = await this.fetch(['id', 'provider_name', 'profile'], oAuthProviderDBTable, 'user_id', id, client, releaseClientAfter)
   
        if (!data || data.rowCount < 1) {
            return null
        }
        const providers = data.rows.map(provider => {
            return {
                id:   provider.id,
                name: provider.provider_name,
                profile: provider.profile
            }
        })
        return providers
    }

    /**
     * Checks whether 2FA is enabled for a given user ID.
     * 
     * @param {string} id - The user's ID.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<boolean>} True if 2FA is enabled, false otherwise.
    */
    isUser2FAEnabled = async (id, client = null, releaseClientAfter = true) => {
        try {
            const result = await this.query('SELECT two_fa_active FROM users WHERE id = $1', [id], true, client, releaseClientAfter)
            return result.rowCount <= 0 ? false : result.rows[0].two_fa_active
        }
        catch (error) {
            cserror('Database get 2fa active state error', error.stack)
            throw error
        }
    }
    /**
     * Generates a new user object with default properties.
     * 
     * @param {string} email - The email address of the new user.
     * @returns {object} The new user object with default properties set.
    */
    getNewUser(email) {
        const userID         = uuidv4()
        const codeExpireDate = new Date()

        codeExpireDate.setHours(codeExpireDate.getHours() + 24)

        return {
            id:                 userID,
            email:              email,
            is_verified:        false,
            verification_code:  generateRandomCode(),
            date:               new Date().toISOString(),
            code_expire_date:   codeExpireDate.toISOString()
        }
    }
    /**
     * Wraps a database operation in a transaction.
     * 
     * @param {Function} operation - The async function representing the transactional operation.
     * @throws {Error} Throws an error if the operation function is not awaitable or has an invalid argument count.
    */
    transaction = async (operation) => {
        const client = await this.#connectToAvailableClient()

        if (!client) {
            return
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
        } catch (e) {
            await this.query('ROLLBACK', null, true, client, false)
            throw e
        } finally {
            client.release()
        }
    }
    /**
     * Updates a specific property of a record in a given table.
     * 
     * @param {string} table - The name of the table to update.
     * @param {string} whereKey - The identifier key of the record to be updated.
     * @param {string} whereValue - The identifier value of the record to be updated.
     * @param {string} property - The property to update.
     * @param {any} value - The new value for the property.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @throws {Error} Throws an error if the update operation fails.
    */
    update = async (table, whereKey, whereValue, property, value, client = null, releaseClientAfter = true) => {
        try {
            const command = `UPDATE ${table} SET ${property} = $1 WHERE ${whereKey} = $2`
            await this.query(command, [value, whereValue], true, client, releaseClientAfter)
        }
        catch (error) {
            console.error('Database update error', error.stack)
            throw error
        }
    }
    /**
     * Inserts a new record into a specified table.
     * 
     * @param {string} table - The name of the table.
     * @param {object} data - The data object to be inserted.
     * @param {DBTableSchema} schema - The schema object representing the structure of the table.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @throws {Error} Throws an error if the insert operation fails.
    */
    push = async (table, data, schema, client = null, releaseClientAfter = true) => {
        const schemaNames  = schema.getColumnNames()

        const entries       = Object.entries(data).filter(([key, _]) => schemaNames.includes(key))
        const keys          = entries.map(([key, _]) => key)
        const values        = entries.map(([_, value]) => value)

        const columns       = keys.join(', ')
        const placeholders  = keys.map((_, index) => `$${index + 1}`).join(', ')

        const command       = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`

        await this.query(command, values, true, client, releaseClientAfter)
    }
    /**
     * Fetches records from a specified table based on query criteria.
     * 
     * @param {string|Array} values - The columns to fetch.
     * @param {string} table - The name of the table to fetch from.
     * @param {string|Array} whereID - The column(s) to match against.
     * @param {any|Array} whereValue - The value(s) to match in the whereID column(s).
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @returns {Promise<object>} A promise that resolves with the fetched records.
     * @throws {Error} Throws an error if the fetch operation fails or if the whereID and whereValue lengths do not match.
    */
    fetch = async (values, table, whereID, whereValue, client = null, releaseClientAfter = true) => {
        const keys   = Array.isArray(values) ? values.join(', ') : values
        let command  = `SELECT ${keys} FROM ${table}`
        
        const { whereClause, queryParams } = this.#formatWhereClause(whereID, whereValue)
        command += whereClause
        
        return await this.query(command, queryParams, true, client, releaseClientAfter)
    }

    remove = async (table, whereID, whereValue, client = null, releaseClientAfter = true) => {
        let command = `DELETE FROM ${table}`

        const { whereClause, queryParams } = this.#formatWhereClause(whereID, whereValue)
        command += whereClause

        return await this.query(command, queryParams, true, client, releaseClientAfter)
    }

    #formatWhereClause = (whereID, whereValue) => {
        let whereClauses = []
        let queryParams  = []
    
        if (Array.isArray(whereID) && Array.isArray(whereValue)) {
            
            if (whereID.length !== whereValue.length) {

                throw new Error("Length of whereID and whereValue arrays must match.")
            }
            whereClauses = whereID.map((id, index) => {

                queryParams.push(whereValue[index])
                return `${id} = $${index + 1}`
            });
        } else {

            whereClauses.push(`${whereID} = $1`)
            queryParams.push(whereValue)
        }
        return {
            whereClause: whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '',
            queryParams: queryParams
        }
    }

    /**
     * Validates the schema of a given table against the provided schema object.
     * 
     * @param {string} tableName - The name of the table to validate.
     * @param {DBTableSchema} schema - The schema object representing the expected structure of the table.
     * @param {pg.PoolClient} client - The client connection to use, if provided.
     * @param {boolean} releaseClientAfter - Flag to release the client after the operation.
     * @throws {Error} Throws an error if the validation fails.
    */
    validateDBTable = async (tableName, schema, client = null, releaseClientAfter = true) => {
        try {
            const sqlQuery = schema.getCreateTableSQL(tableName)
            await this.query(sqlQuery, [], false, client, releaseClientAfter)
    
        } catch (error) {
            
            cserror('Database table validation error', error.stack)
            throw error
        }
    }

    /**
     * Connects to an available client from the pool.
     * 
     * @returns {Promise<pg.PoolClient>} A promise that resolves with a connected client.
     * @throws {Error} Throws an error if the connection fails.
    */
    #connectToAvailableClient = async () => {
        try {
            return await this.pool.connect()
        }
        catch (error) {

            cserror('Database get client error', error.stack)
            throw error
        }
    }
}