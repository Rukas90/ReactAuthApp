import { getOAuthProvider, validateOAuthProvider } from '#queries/oauth.queries.js'
import { createLinkedNewUser, DEFAULT_USER_FIELDS, getUserByEmail, getUserById } from '#queries/user.queries.js'
import { database }     from "#services/database.service.js"
import { logDevError }  from '#services/logger.js'

export const authenticateWithOAuth = async (req, profile, done, providerName, getProfileData) => {
    const operation = async (client) => {
        try {
            const email         = profile.emails?.[0]?.value
            let   existingUser  = null
            const profileID     = profile.id
        
            if (!email) {
                const provider = await getOAuthProvider(profileID, providerName, 'user_id', client, false)

                if (!provider || !provider.user_id) {

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
                existingUser = await getUserById(provider.user_id, DEFAULT_USER_FIELDS, client, false)

                if (!existingUser) {
                    throw new Error("User cannot be authenticated.") // <-- Prop needs some further handling like removing the oauth provider all together
                }
            }
            else {
                existingUser = await getUserByEmail(email, DEFAULT_USER_FIELDS, client, false)
            }
            let user = existingUser
    
            if (!existingUser) { 
                user = await createLinkedNewUser(email, client, false)
            }
            const oauthValidation = validateOAuthProvider(user.id, providerName, profileID, getProfileData(profile), client, false);

            if (!oauthValidation) {
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
    // TODO :: Requires manual identification
}

export const oauthIdentify = async (req, res) => {
    const oauthData = req.session.pendingOAuth
    const provider  = oauthData.provider
    
    try {
        const email = req.body.email

        if (!email) {
            return res.status(400).json({ error: "Could not identify user. Email is invalid!" })
        }
        const existingUser = await getUserByEmail(email)
        let   user         = existingUser
    
        if (!existingUser) {
            user = await createLinkedNewUser(email)
        }
        const oauthValidation = await validateOAuthProvider(user.id, provider.name, provider.id)

        if (!oauthValidation) {
            return res.status(400).json({ error: "Invalid provider's identification token" })
        }
        return res.status(200).json({ message: "Identified successfully!", authRedirect: provider.name })
    }
    catch (error) {
        logDevError(`Failed identifying ${provider.name} provider`, error)
        return res.status(500).json({ error: "Internal Server Error!" })
    }
}