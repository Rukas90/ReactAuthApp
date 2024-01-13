import speakeasy                  from 'speakeasy'
import QRCode                     from 'qrcode'
import { encryptAES, decryptAES } from './security.js'

export const get_2fa_status = async (req, res, server) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: "User is not logged in!"
        })
    }
    const user = req.user

    if (!user) {
        return res.status(404).json({ 
            error: "User is not found!"
        })
    }
    const response = await server.database.fetch('two_fa_active', 'users', 'id', user.id)

    return res.status(200).json({ 
        state: response.rowCount <= 0 ? false : response.rows[0].two_fa_active
    })
}

export const get_2fa_data = async (req, res, server) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "User is not logged in!"
        })
    }
    const user = req.user

    if (!user) {
        return res.status(404).json({ 
            message: "User is not found!"
        })
    }
    const response = await server.database.fetch('two_fa_secret', 'users', 'id', user.id)

    let otpauth_url
    let base32

    if (response.rowCount > 0 && response.rows[0].two_fa_secret) { // User already has a 2FA secret

        base32      = decryptAES(response.rows[0].two_fa_secret, process.env.TWOFA_SECRET_KEY)
        otpauth_url = speakeasy.otpauthURL({
            secret:     base32,
            label:      encodeURIComponent(`ReactAuthApp:${user.email}`),
            issuer:     'ReactAuthApp',
            algorithm:  'SHA1',
            digits:     6,
            period:     30
        })

    } else { // Generate a new secret for the user
        
        const secret = speakeasy.generateSecret({
            name: `ReactAuthApp:${user.email}`,
            length: 20
        });
        otpauth_url = secret.otpauth_url
        base32      = secret.base32

        await server.database.updateUser(user.id, 'two_fa_secret', encryptAES(base32, process.env.TWOFA_SECRET_KEY))
    }
    QRCode.toDataURL(otpauth_url, (err, data_url) => {
        if (err) {
            console.error('Error generating QR code:', err);
            return res.status(500).json({ message: "Error generating QR code" });
        }
        res.status(200).json({ 
            qr_link:   data_url,
            entry_key: base32
        })
    })
}

export const verify_2fa_code = async (req, res, server) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "User is not logged in" 
        })
    }
    const code = req.body.code
    const user = req.user;

    if (!user) {
        return res.status(404).json({ 
            error: "User is not found!"
        })
    }

    try {
        // Fetch the user's 2FA secret from the database
        const response = await server.database.fetch('two_fa_secret', 'users', 'id', user.id)

        if (response.rowCount <= 0) {
            return res.status(404).json({ message: "2FA secret not found" })
        }
        const userSecret = decryptAES(response.rows[0].two_fa_secret, process.env.TWOFA_SECRET_KEY)

        // Verify the token with the secret
        const verified = speakeasy.totp.verify({

            secret:    userSecret,
            encoding:  'base32',
            token:     code,
            window:    2

        })
        if (!verified) {
            res.status(400).json({ message: "Invalid 2FA code" })
            return
        }
        if (!user.two_fa_active) {

            user.two_fa_active = true
            
            await server.database.updateUser(user.id, 'two_fa_active', true)
        }
        res.status(200).json({ message: "2FA code verified successfully" })

    } catch (error) {
        console.error('Error verifying 2FA code:', error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deactivate_2fa = async (req, res, server) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "User is not logged in" 
        })
    }
    const user = req.user;

    if (!user) {
        return res.status(404).json({ 
            error: "User is not found!"
        })
    }
    try {
        await server.database.updateUser(user.id, 'two_fa_secret', '')

        user.two_fa_active = false
            
        await server.database.updateUser(user.id, 'two_fa_active', false)

        res.status(200).json({ message: "2FA was deactivated successfully" })

    } catch (error) {
        console.error('Error deactivating 2FA:', error)
        res.status(500).json({ message: "Internal server error" })
    }
}