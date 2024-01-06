import { v4 as uuidv4 } from 'uuid'
import { generateRandomCode } from './utils.js'

export class User {
    constructor(id, email, password) {
        this.id                 = id || uuidv4()
        this.email              = email
        this.password           = password
        this.is_verified        = false
        this.verification_code  = generateRandomCode()
        this.date               = new Date().toISOString()

        const codeExpireDate    = new Date();
        codeExpireDate.setHours(codeExpireDate.getHours() + 24);

        this.code_expire_date   = codeExpireDate.toISOString();
        this.google_id          = ''
        this.twitter_id         = ''
    }
}