import { v4 as uuidv4 } from 'uuid'

export const getNewUser = (email, passwordHash) => {
    return {
        id:          uuidv4(),
        email:       email,
        password:    passwordHash,
        is_verified: false,
        date:        new Date().toISOString(),
    }
}