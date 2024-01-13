export class User {
    constructor(id, email) {
        this.id            = id
        this.email         = email
        this.is_verified   = false
        this.two_fa_active = false
    }
}