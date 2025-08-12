import { v4 as uuidv4 } from 'uuid'

export const createNewOAuthData = (userID, providerName, providerID, newProfileData) => {
    return {
        id:            uuidv4(),
        user_id:       userID,
        provider_name: providerName,
        provider_id:   providerID,
        profile:       newProfileData
    }
}