import { verificationCodeDBTableSchema, verificationsDBTable } from "#config/verifications.db.config.js"
import { database }                                            from "#services/database.service.js"

export const addNewVerification = async (verification, client = null, releaseClientAfter = true) => {

    await database.push(verificationsDBTable, verification, verificationCodeDBTableSchema, 
        client, releaseClientAfter)
}
export const getVerification = async (values = '*', whereID, whereValue, client = null, releaseClientAfter = true) => {
    const result = await database.fetch(values, verificationCodeDBTableSchema, verificationsDBTable, whereID, whereValue,
        client, releaseClientAfter)

    if (!result || result.rowCount <= 0) {
        return null
    }
    return result.rows[0]
}
export const removeVerification = async (verificationID, userID, client = null, releaseClientAfter = true) => {
    await database.remove(verificationsDBTable, ['id', 'user_id'], [verificationID, userID], 
        client, releaseClientAfter)
}
export const removeUserVerifications = async (userID, client = null, releaseClientAfter = true) => {
    await database.remove(verificationsDBTable, 'user_id', userID,
        client, releaseClientAfter)
}
export const setVerificationProperty = async (setID, setValue, whereID, whereValue, client = null, releaseClientAfter = true) => {
    await database.update(verificationsDBTable, setID, setValue, whereID, whereValue,
        client, releaseClientAfter)
}