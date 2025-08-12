import speakeasy                  from 'speakeasy'
import QRCode                     from 'qrcode'
import { encryptAES, decryptAES } from '#utils/security.js'
import {
     clearUser2FA, 
     getUser2FAActiveState, 
     getUser2FASecret, 
     setUser2FAActiveState, 
     setUser2FASecret 
}                                 from '#queries/user.2fa.queries.js'
import { logDevError }            from '#services/logger.js'

/**
 * Checks the 2FA (Two-Factor Authentication) status of a user.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object used to return the 2FA status.
 * @returns {Promise} A promise that resolves with the 2FA status of the user.
*/
export const get2FAStatus = async (req, res) => {
    const user    = req.user
    const enabled = await getUser2FAActiveState(user.id)

    return res.status(200).json({ 
        state: enabled
    })
}

/**
 * Authenticates a user using 2FA.
 * 
 * @param {object} req - The request object containing the 2FA code and user information.
 * @param {object} res - The response object used to return authentication results.
 * @returns {Promise} A promise that resolves with the result of the 2FA authentication.
*/
export const auth2FA = async (req, res) => {
    const user = req.user
    const code = req.body.code

    try {
        const verification = await verify2FACode(user, code)

        if (verification.verified) {
            req.session.AuthentificationState = 3
            req.session.save()
        }
        return res.status(verification.status).json({ message: verification.message })
    }
    catch (error) {
        logDevError('Error authenticating 2FA step:', error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

/**
 * Verifies a 2FA code against the user's stored 2FA secret.
 * 
 * @param {object} user - The user object containing the user's 2FA secret.
 * @param {string} code - The 2FA code to be verified.
 * @returns {Promise} A promise that resolves with the result of the 2FA code verification.
*/
const verify2FACode = async (user, code) => {
    const secret = await getUser2FASecret(user.id)

    if (secret === null) {
        return { verified: false, message: '2FA secret not found', status: 404 }
    }
    const userSecret = decryptAES(secret, process.env.TWOFA_SECRET_KEY)

    // Verify the token with the secret
    const verified = speakeasy.totp.verify({

        secret:    userSecret,
        encoding:  'base32',
        token:     code,
        window:    2
    })
    return { 
        verified: verified, 
        message:  verified ? 'Successfully 2FA authenticated' : 'Invalid 2FA code', 
        status:   verified ? 200 : 400 }
}

/**
 * Retrieves 2FA data for a user, including the QR code for 2FA setup.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object used to return the 2FA data.
 * @returns {Promise} A promise that resolves with the 2FA data.
*/
export const get2FAData = async (req, res) => {
    const user   = req.user
    const secret = await getUser2FASecret(user.id)

    let otpauth_url
    let base32

    if (secret) { // User already has a 2FA secret

        base32      = decryptAES(secret, process.env.TWOFA_SECRET_KEY)
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

        await setUser2FASecret(user.id, encryptAES(base32, process.env.TWOFA_SECRET_KEY))
    }

    QRCode.toDataURL(otpauth_url, (error, data_url) => {
        if (error) {
            logDevError('Error generating QR code:', error);
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
export const verify2FA = async (req, res) => {
    const user = req.user
    const code = req.body.code

    try {
        if (!(await verify2FACode(user, code))) {
            return res.status(400).json({ error: "Invalid 2FA code" })
        }
        if (!user.two_fa_active) {
        
            user.two_fa_active = true
            await setUser2FAActiveState(user.id, true)
        }
        return res.status(200).json({ message: "2FA code verified successfully" })

    } catch (error) {
        logDevError('Error verifying 2FA code:', error)
        res.status(500).json({ error: "Internal server error" })
    }
}

/**
 * Deactivates 2FA for a user.
 * 
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object used to return deactivation results.
 * @returns {Promise} A promise that resolves with the result of the 2FA deactivation.
*/
export const deactivate2FA = async (req, res) => {
    const user = req.user

    await clearUser2FA(user.id)
    user.two_fa_active = false

    res.status(200).json({ message: "2FA was deactivated successfully" })
}