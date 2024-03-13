import { hashPassword }        from "./security.js"
import { isSessionBlocked }    from "./session-management.js"
import { 
    oAuthProviderDBTable, 
    sessionsDBTable, 
    userSessionValidation, 
    usersDBTable 
}                              from "./utils.js"
import bcrypt                  from 'bcrypt'

export const updateUserPassword = async (req, res) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    if (await isSessionBlocked(req)) {
        return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
    }
    const password = req.body.password

    if (!password) {
        return res.status(400).json({ error: 'The provided password value is invalid!' })
    }
    const database = req.app.locals.database

    try {
        await database.update(usersDBTable, 'id', req.user.id, 'password', await hashPassword(password))
        return res.status(200).json({ message: 'The user password is updated successfully!' })
    }
    catch (error) {
        console.error('Error when updating the user password:', error)
        return res.status(400).json({ error: 'Internal server error!' })
    }
}
export const verifyUserPassword = async (req, res) => {
    if (!userSessionValidation(req, res)) {
        return
    }
    if (await isSessionBlocked(req)) {
        return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
    }
    const user     = req.user
    const password = req.body.password
    const database = req.app.locals.database

    const userPassword = await database.getUserPassword(user.id)

    if (!userPassword) {
        return res.status(400).json({ error: 'User does not have a password.' })
    }
    const isValid = await bcrypt.compare(password + process.env.PEPPER_KEY, userPassword)
    
    return res.status(200).json({ status: isValid })
}
export const deleteUserAccount = async (req, res) => {
    if (!userSessionValidation(req, res)) {
        return res.status(401)
    }
    if (await isSessionBlocked(req)) {
        return res.status(403).json({ error: 'Access is temporary blocked. Try again later.' })
    }
    const user     = req.user
    const database = req.app.locals.database

    let status;
    let data;

    const operation = async (client) => {
        try {
            await database.remove(oAuthProviderDBTable, 'user_id', user.id, client, false)
            await database.remove(sessionsDBTable, 'user_id', user.id, client, false)
            await database.remove(usersDBTable, 'id', user.id, client, false)

            req.session.destroy()

            status = 200;
            data   = { message: "Account was deleted successfully!" }
        }
        catch {
            console.error(`Failed deleting the user account`, error)

            status = 400;
            data   = { error: "Internal Server Error!" }
        }
    }
    await database.transaction(operation)

    return res.status(status).json(data)
}