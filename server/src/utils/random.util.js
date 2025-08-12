import crypto from 'crypto'

export const generateRandomCode = (length = 6, hasLetters = false) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const palette = hasLetters ? letters + numbers : numbers    
    const randomValues = crypto.randomBytes(length)

    let code = ''
    for (let i = 0; i < length; i++) {
        code += palette.charAt(randomValues[i] % palette.length)
    }

    return code
}