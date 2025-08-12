import { database }    from "#services/database.service.js"
import { logDevError } from "#services/logger.js"
import { oAuthProviderDBTable, oAuthProvidersDBTableSchema } from "#config/oauth-providers.db.config.js"
import { createNewOAuthData } from "#models/oauth.model.js"

const DEFAULT_OAUTH_PROVIDER_FIELDS = ['id', 'provider_id', 'profile']

export const getOAuthProviders = async (userId, fields = DEFAULT_OAUTH_PROVIDER_FIELDS, client = null, releaseClientAfter = true) => {
    const result = await database.fetch(fields, oAuthProvidersDBTableSchema, oAuthProviderDBTable, 'user_id', userId, 
        client, releaseClientAfter)

    if (!result || result.rowCount < 1) {
        return null
    }
    return result.rows
}
export const getOAuthProvider = async (providerID, providerName, fields = DEFAULT_OAUTH_PROVIDER_FIELDS, client = null, releaseClientAfter = true) => {
    try {
        const result = await database.fetch(
            fields, 
            oAuthProvidersDBTableSchema,
            oAuthProviderDBTable, 
            ['provider_id', 'provider_name'], [providerID, providerName],
            client, releaseClientAfter
        )
        if (!result || result.rowCount < 1) {
            return null
        }
        return result.rows[0]
    }
    catch (error) {
        logDevError('Database get oauth provider error', error.stack)
        throw error
    }
}

export const removeUserOAuthProvider = async (userID, client = null, releaseClientAfter = true) => {
    await database.remove(oAuthProviderDBTable, 'user_id', userID, 
        client, releaseClientAfter)
}

export const validateOAuthProvider = async (userID, providerName, providerID, profileData, client = null, releaseClientAfter = true) => {
    try {
        const result = await database.fetch(
            ['id', 'provider_id', 'profile'],
            oAuthProvidersDBTableSchema,
            oAuthProviderDBTable, 
            ['user_id', 'provider_name'], [userID, providerName]
        )
        const newProfileData = JSON.stringify(profileData)

        if (result && result.rowCount > 0) {

            if (JSON.stringify(result.profile) !== newProfileData) {

                await database.update(oAuthProviderDBTable, 'profile', newProfileData, 'id', result.rows[0].id)
            }

            return result.rows[0].provider_id === providerID
        }
        if (!userID || !providerName || !providerID) {

            return false
        }
        const newProviderData = createNewOAuthData(userID, providerName, providerID, newProfileData)
        await database.push(oAuthProviderDBTable, newProviderData, oAuthProvidersDBTableSchema, client, releaseClientAfter)
        
        return true
    }
    catch (error) {
        logDevError('Database validate oauth provider error', error.stack)
        throw error
    }
}