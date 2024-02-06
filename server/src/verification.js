import { mail } from "./mailer.js"
import { blockSession, isSessionBlocked } from "./session-management.js"
import { generateRandomCode, userSessionValidation } from "./utils.js"

const MAX_ATTEMPTS = 5

export const send_verification_code = async (req, res) => {
    try {
        if (!userSessionValidation(req, res)) {
            return
        }
        if (await isSessionBlocked(req)) {
            return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
        }
        if (!req.user.email) {
            return res.status(400).json({ error: 'The user email is invalid!' })
        }
        const key = req.body.key

        if (!key) {
            return res.status(400).json({ error: 'The key value is not provided!' })
        }
        const code = generateRandomCode(6, true)

        req.session[key] = {
            code:     code,
            attempts: 0,
            expiry:   Date.now() + 300000 // Expires in 5 minutes
        }
        await mail({
            recipient: req.user.email,
            subject: 'Verification code',
            body: `The code is ${code}`
        })
        res.status(200).json({ message: "Verification code sent successfully." })
    }
    catch (error) {
        console.error('Error while sending verification code:', error)
        return res.status(500).json({ error: 'Internal server error!' }) 
    }
}
export const check_verification_code = async (req, res) => {
    try {
        if (!userSessionValidation(req, res)) {
            return
        }
        if (await isSessionBlocked(req)) {
            return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
        }
        const key = req.body.key

        if (!key) {
            console.log("The key value is not provided!")
            return res.status(400).json({ error: 'The key value is not provided!' })
        }
        const code = req.body.code
        const data = req.session[key]

        if (!data) {
            console.log(`The verification by the key '${key}' is not found!`)
            return res.status(400).json({ error: `The verification by the key '${key}' is not found!` })
        }
        if (data.expiry < Date.now()) {
            clear_code(req, key)

            console.log('The verification code has expired!')
            return res.status(400).json({ error: 'The verification code has expired!' })
        }
        const status = data.code === code

        if (status) {

            clear_code(req, key)
            return res.status(200).json({ message: 'The verification was successfully!' })

        } else {
            if (req.session[key].attempts + 1 > MAX_ATTEMPTS) {
                clear_code(req, key)

                await blockSession(req, 'Too Many Verification Attempts', 5) // 5 Seconds

                return res.status(429).json({ status: false, tooManyAttempts: true })
            }
            req.session[key].attempts++
            req.session.save()
        }
        return res.status(401).json({ error: 'The verification code is incorrect!' })
    }
    catch (error) {
        console.error('Error while checking verification code:', error)
        return res.status(500).json({ error: 'Internal server error!' })
    }
}
export const clear_verification_code = async (req, res) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    if (await isSessionBlocked(req)) {
        return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
    }
    const key = req.body.key

    if (!key) {
        return res.status(400).json({ error: 'The key value is not provided!' })
    }
    clear_code(req, key)

    res.status(200).json({ message: "Verification code is canceled successfully." })
}
const clear_code = (req, key) => {
    delete req.session[key]
    req.session.save()
}