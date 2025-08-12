import CryptoJS                                          from 'crypto-js'
import bcrypt                                            from 'bcrypt'
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'

const SALT_ROUNDS = 10
const PEPPER      = process.env.PEPPER_KEY
const ALGO        = 'aes-256-gcm'

export const encryptObject = (obj, secret) => {
    const iv     = randomBytes(12)
    const key    = Buffer.from(secret, 'base64')
    const cipher = createCipheriv(ALGO, key, iv)
    const json   = JSON.stringify(obj)

    let encrypted = cipher.update(json, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag().toString('base64')

    return { 
        data: encrypted, 
        iv:   iv.toString('base64'), 
        tag:  authTag 
    }
}
export const decryptObject = (data, iv, tag, secret) => {
    const key      = Buffer.from(secret, 'base64')
    const decipher = createDecipheriv(ALGO, key, Buffer.from(iv, 'base64'))
    decipher.setAuthTag(Buffer.from(tag, 'base64'))

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(data, 'base64')),
      decipher.final()
    ])
    return JSON.parse(decrypted.toString('utf8'))
}
export const encryptAES = (text, secret) => {
    return CryptoJS.AES.encrypt(text, secret).toString()
}
export const decryptAES = (ciphertext, secret) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret)
    
    return bytes.toString(CryptoJS.enc.Utf8)
}
export const hashValue = async (value) => {
    const salt        = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedValue = await bcrypt.hash(value + PEPPER, salt)

    return hashedValue
}
export const compareHashes = async (valueToHash, originalHash) => {
    return await bcrypt.compare(valueToHash + PEPPER, originalHash)
}