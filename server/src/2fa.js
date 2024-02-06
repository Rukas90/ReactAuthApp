import speakeasy                                 from 'speakeasy'
import QRCode                                    from 'qrcode'
import { encryptAES, decryptAES }                from './security.js'
import { userSessionValidation, usersDBTable } from './utils.js'

/**
 * Checks the 2FA (Two-Factor Authentication) status of a user.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object used to return the 2FA status.
 * @param {object} server - The server object to interact with the database.
 * @returns {Promise} A promise that resolves with the 2FA status of the user.
*/
export const get_2fa_status = async (req, res, server) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    const user = req.user
    const response = await server.database.fetch('two_fa_active', usersDBTable, 'id', user.id)

    return res.status(200).json({ 
        state: response.rowCount <= 0 ? false : response.rows[0].two_fa_active
    })
}

/**
 * Retrieves 2FA data for a user, including the QR code for 2FA setup.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object used to return the 2FA data.
 * @param {object} server - The server object to interact with the database.
 * @returns {Promise} A promise that resolves with the 2FA data.
*/
export const get_2fa_data = async (req, res, server) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    const user = req.user
    const response = await server.database.fetch('two_fa_secret', usersDBTable, 'id', user.id)

    let otpauth_url
    let base32

    if (response.rowCount > 0 && response.rows[0].two_fa_secret) { // User already has a 2FA secret

        base32      = decryptAES(response.rows[0].two_fa_secret, process.env.TWOFA_SECRET_KEY)
        otpauth_url = speakeasy.otpauthURL({
            secret:     base32,
            label:      encodeURIComponent(`ReactAuthApp: ${user.email}`),
            issuer:     'ReactAuthApp',
            algorithm:  'SHA1',
            digits:     6,
            period:     30
        })

    } else { // Generate a new secret for the user
        
        const secret = speakeasy.generateSecret({
            name: `ReactAuthApp: ${user.email}`,
            length: 20
        });
        otpauth_url = secret.otpauth_url
        base32      = secret.base32

        await server.database.update(usersDBTable, 'id', user.id, 'two_fa_secret', encryptAES(base32, process.env.TWOFA_SECRET_KEY))
    }
    QRCode.toDataURL(otpauth_url, (error, data_url) => {
        if (error) {
            console.error('Error generating QR code:', error);
            return res.status(500).json({ error: "Error generating QR code" });
        }
        res.status(200).json({ 
            qr_link:   data_url,
            entry_key: base32
        })
    })
}

/**
 * Verifies the 2FA code provided by the user.
 * 
 * @param {object} req - The request object containing the 2FA code and user information.
 * @param {object} res - The response object used to return verification results.
 * @param {object} server - The server object to interact with the database.
 * @returns {Promise} A promise that resolves with the result of the 2FA code verification.
*/
export const verify_2fa = async (req, res, server) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    const user = req.user
    const code = req.body.code

    try {
        if (!(await verify_2fa_code(user, code, server))) {
            return res.status(400).json({ error: "Invalid 2FA code" })
        }
        if (!user.two_fa_active) {

            user.two_fa_active = true
            
            await server.database.update(usersDBTable, 'id', user.id, 'two_fa_active', true)
        }
        return res.status(200).json({ message: "2FA code verified successfully" })

    } catch (error) {
        console.error('Error verifying 2FA code:', error)
        res.status(500).json({ error: "Internal server error" })
    }
}
/**
 * Authenticates a user using 2FA.
 * 
 * @param {object} req - The request object containing the 2FA code and user information.
 * @param {object} res - The response object used to return authentication results.
 * @param {object} server - The server object to interact with the database.
 * @returns {Promise} A promise that resolves with the result of the 2FA authentication.
*/
export const auth_2fa = async (req, res, server) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    const user = req.user
    const code = req.body.code

    try {
        if (!(await verify_2fa_code(user, code, server))) {
            return res.status(400).json({ error: "Invalid 2FA code" })
        }
        req.session.AuthentificationState = 3
        req.session.save()

        return res.status(200).json({ message: "Successfully 2FA authenticated" })
    }
    catch (error) {
        console.error('Error authenticating 2FA step:', error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
/**
 * Verifies a 2FA code against the user's stored 2FA secret.
 * 
 * @param {object} user - The user object containing the user's 2FA secret.
 * @param {string} code - The 2FA code to be verified.
 * @param {object} server - The server object to interact with the database.
 * @returns {Promise} A promise that resolves with the result of the 2FA code verification.
*/
const verify_2fa_code = async (user, code, server) => {
    try {
        // Fetch the user's 2FA secret from the database
        const response = await server.database.fetch('two_fa_secret', usersDBTable, 'id', user.id)

        if (response.rowCount <= 0) {
            return res.status(404).json({ error: "2FA secret not found" })
        }
        const userSecret = decryptAES(response.rows[0].two_fa_secret, process.env.TWOFA_SECRET_KEY)

        // Verify the token with the secret
        return speakeasy.totp.verify({

            secret:    userSecret,
            encoding:  'base32',
            token:     code,
            window:    2
        })
    }
    catch (error) {
        throw error
    }
}
/**
 * Deactivates 2FA for a user.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object used to return deactivation results.
 * @param {object} server - The server object to interact with the database.
 * @returns {Promise} A promise that resolves with the result of the 2FA deactivation.
*/
export const deactivate_2fa = async (req, res, server) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    const user = req.user

    try {
        const database = server.database

        const operation = async (client) => {
            await database.update(usersDBTable, 'id', user.id, 'two_fa_secret', '', client, false)

            user.two_fa_active = false
                
            await database.update(usersDBTable, 'id', user.id, 'two_fa_active', false, client, false)
    
            res.status(200).json({ message: "2FA was deactivated successfully" })
        }
        await database.transaction(operation)

    } catch (error) {
        console.error('Error deactivating 2FA:', error)
        res.status(500).json({ error: "Internal server error" })
    }
}
