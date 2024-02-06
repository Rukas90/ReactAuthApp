import CryptoJS from 'crypto-js'
import bcrypt   from 'bcrypt'

export const encryptAES = (text, secret) => {
    return CryptoJS.AES.encrypt(text, secret).toString()
}
export const decryptAES = (ciphertext, secret) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret)
    
    return bytes.toString(CryptoJS.enc.Utf8)
}
export const hashPassword = async (password) => {
    const salt           = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password + process.env.PEPPER_KEY, salt)

    return hashedPassword
}