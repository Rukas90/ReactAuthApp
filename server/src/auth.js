import { promisify }           from 'util'
import { 
    oAuthProviderDBTable, 
    usersDBTable,
    userSessionValidation
}                              from './utils.js'
import { hashPassword }        from './security.js'
import { isSessionBlocked }    from "./session-management.js"
import { mail }                from "./mailer.js"

/**
 * Retrieves the authentication status of the current user.
 * 
 * @param {object} req - The request object containing user information and session data.
 * @param {object} res - The response object used to return the authentication status.
 * @returns The authentication status of the user.
*/
export const get_auth_status = (req, res) => {
    const authenticated = req.isAuthenticated()
    const user          = authenticated ? req.user : null
    const isVerified    = user ? user.is_verified : false
    const authState     = req.session.AuthentificationState

    return res.json({
        authenticated: authenticated,
        isVerified:    isVerified,
        authState:     authState
    })
}
/**
 * Registers a new user in the system.
 * 
 * @param {object} req - The request object containing the new user's email and password.
 * @param {object} res - The response object used to indicate the result of the registration.
 * @param {object} server - The server object to interact with the database.
 * @returns A response indicating the success or failure of the registration process.
*/
export const register_user = async (req, res, server) => {
    const email    = req.body.email 
    const password = req.body.password

    const database = server.database

    try {
        const user = await database.query('SELECT * FROM users WHERE email = $1', [email])

        if (user.rowCount > 0) {
            return res.status(409).json({ error: 'User already exists' })
        }
        const newUser = await database.createUser(email, await hashPassword(password))

        if (!newUser.is_verified) {
            await mail({
                recipient: email,
                subject: 'Account Verification Code',
                body: `The code is ${newUser.verification_code}`
            })
        }
        res.status(200).json({ message: "User registered successfully" })
    } catch (error) { 
        console.error('Error (register_user):', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
/**
 * Verifies a user's account using a verification code.
 * 
 * @param {object} req - The request object containing the verification code and user information.
 * @param {object} res - The response object used to indicate the result of the verification.
 * @param {object} server - The server object to interact with the database.
 * @returns A response indicating the success or failure of the verification process.
*/
export const verify_verification_code = async (req, res, server) => {

    if (!userSessionValidation(req, res)) {
        return
    }
    if (await isSessionBlocked(req)) {
        return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
    }
    const code = req.body.code
    const user = req.user

    try {
        const response = await server.database.fetch('verification_code', usersDBTable, 'id', user.id)

        if (response.rowCount <= 0) {
            return res.status(404).json({ 
                error: "User verification code is not found!"
            })
        }
        const verification_code = response.rows[0].verification_code

        if (verification_code !== code) {
            return res.status(400).json({ error: 'Invalid verification code.' })
        }
        await server.database.update(usersDBTable, 'id', user.id, 'is_verified', true)

        user.is_verified = true

        return res.status(200).json({ message: 'Verified successfully!' })
    }
    catch (error) {
        console.error('Error (verify_verification_code):', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
/**
 * Logs out the current user.
 * 
 * @param {object} req - The request object containing session and user information.
 * @param {object} res - The response object used to return the logout result.
 * @param {object} server - The server object to manage session and CSRF token.
 * @returns A response indicating the success or failure of the logout process.
*/
export const log_out_user = async (req, res, server) => {
    try {
        if (!userSessionValidation(req, res)) {
            return
        }
        const logout = promisify(req.logout).bind(req)

        await logout()

        if (req.session) {
            delete req.session.passport
        }
        server.syncCSRFSecret(req)

        return res
        .status(200)
        .cookie('X-CSRF-Token', server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: process.env.SAME_SITE })
        .json({ message: "Logged out successfully" })
    }
    catch (error) {
        console.error("Error (log_out_user):", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const oauth_authentication = async (req, profile, done, server, providerName, getProfileData) => {
    const database = server.database

    const operation = async (client) => {
        try {
            const email         = profile.emails?.[0]?.value
            let   existingUser  = null
            const profileID     = profile.id

            if (!email) {
                const data = await database.fetch(
                    ['user_id'], 
                    oAuthProviderDBTable, 
                    ['provider_id', 'provider_name'], [profileID, providerName],
                    client, false
                )
                if (!data || data.rowCount < 1 || !data.rows[0].user_id) {

                    req.session.pendingOAuth = {
                        provider: {
                            id:    profileID,
                            name:  providerName
                        }
                    }
                    req.session.AuthentificationState = 1 // Awaiting manual identification state
                    req.session.save()

                    return done(null, false)
                }
                existingUser = await database.getUserById(data.rows[0].user_id, client, false)

                if (!existingUser) {
                    throw new Error("User cannot be authenticated.") // <-- Prop needs some further handling like removing the oauth provider all together
                }
            }
            else {
                existingUser = await database.getUserByEmail(email, client, false)
            }
            let user = existingUser
    
            if (!existingUser) { 
                user = await database.createLinkedNewUser(email, client, false)
            }
            if (!await database.validateOAuthProvider(user.id, providerName, profileID, getProfileData(profile), client, false)) {
                return done(null, null, { message: "Invalid provider's identification token" })
            }
            return done(null, user)
        }
        catch (error) {
            console.error(`Failed ${providerName} authentication`, error)
            return done(error)
        }
    }
    await database.transaction(operation)

    if (!req.session.pendingOAuth) {
        return
    }
    // Requires manual identification ...
}

export const oauthIdentify = async (req, res, server) => {
    const database  = server.database
    const oauthData = req.session.pendingOAuth
    const provider  = oauthData.provider
    
    if (!database) {
        console.error('Error (oauthIdentify): No database found!')
        return res.status(500).json({ error: "Internal Server Error!" })
    }
    try {
        const email = req.body.email

        if (!email) {
            return res.status(400).json({ error: "Could not identify user. Email is invalid!" })
        }
        const existingUser = await database.getUserByEmail(email)
        let   user         = existingUser
    
        if (!existingUser) {
            user = await database.createLinkedNewUser(email)
        }
        if (!await database.validateOAuthProvider(user.id, provider.name, provider.id)) {
            return res.status(400).json({ error: "Invalid provider's identification token" })
        }
        return res.status(200).json({ message: "Identified successfully!", authRedirect: provider.name })
    }
    catch (error) {
        console.error(`Failed identifying ${provider.name} provider`, error)
        return res.status(500).json({ error: "Internal Server Error!" })
    }
}