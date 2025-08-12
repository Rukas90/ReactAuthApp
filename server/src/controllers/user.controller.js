import { compareHashes, hashValue } from "#utils/security.js"
import { 
    getUserPassword, 
    removeUser, 
    setUserPassword, 
    setUserVerifiedState 
}                                   from "#queries/user.queries.js"
import { logDevError }              from "#services/logger.js"
import { removeUserOAuthProvider }  from "#queries/oauth.queries.js"
import { removeUserSession }        from "#queries/user.session.queries.js"
import { database }                 from "#services/database.service.js"
import { removeUserVerifications }  from "#queries/verification.queries.js"
import { sendRedirectSuccessResponse } from "#responses/success.response.js"

export const updateUserPassword = async (req, res) => {
    const password = req.body.password

    if (!password) {
        return res.status(400).json({ error: 'The provided password value is invalid!' })
    }
    try {
        const userID         = req.user.id
        const hashedPassword = await hashValue(password)

        await setUserPassword(userID, hashedPassword)

        return res.status(200).json({ message: 'The user password is updated successfully!' })
    }
    catch (error) {
        logDevError('Error when updating the user password:', error)
        return res.status(400).json({ error: 'Internal server error!' })
    }
}
export const verifyUserPassword = async (req, res) => {
    const user          = req.user
    const passwordInput = req.body.password

    const userPassword = await getUserPassword(user.id)

    if (!userPassword) {
        return res.status(400).json({ error: 'User does not have a password.' })
    }
    const isValid = await compareHashes(passwordInput, userPassword)
    
    return res.status(isValid ? 200 : 401).json({ status: isValid })
}
export const deleteUserAccount = async (req, res) => {
    const userID = req.user.id

    try {
        const operation = async (client) => {
            await removeUserOAuthProvider(userID, client, false)
            // TODO :: REMOVE BLOCKED SESSIONS
            await removeUserSession(userID, client, false)
            await removeUserVerifications(userID, client, false)
            await removeUser(userID, client, false)
        }
        await database.transaction(operation)
        req.session.destroy()

        return sendRedirectSuccessResponse(process.env.CLIENT_ORIGIN)
    }
    catch (error) {
        logDevError('Failed deleting the user account', error)
        return res.status(400).json({ message: "Internal Server Error!" })
    }
}
export const verifyUserAccount = async (req) => {
    const user = req.user
    await setUserVerifiedState(user.id, true)
    user.is_verified = true
}