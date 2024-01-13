import CryptoJS from 'crypto-js';

export const encryptAES = (text, secret) => {
    return CryptoJS.AES.encrypt(text, secret).toString()
}
export const decryptAES = (ciphertext, secret) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}