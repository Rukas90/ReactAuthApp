import { encryptObject, hashValue } from '#utils/security.js'
import { v4 as uuidv4 }             from 'uuid'

export const getNewVerificationData = async (userID, type, code, dispatch, validDurationInHours, maxAttempts = 5) => {
    const codeHash = await hashValue(code)
    const now      = new Date()
    const expires  = new Date(now)

    expires.setHours(expires.getHours() + validDurationInHours)

    return {
        id:            uuidv4(),
        user_id:       userID,
        type:          type,
        code_hash:     codeHash,
        dispatch:      encryptObject(dispatch, process.env.PAYLOAD_MASTER_KEY),
        expires_at:    expires,
        attempts_left: maxAttempts,
        created_at:    now
    }
}