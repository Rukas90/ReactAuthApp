import { v4 as uuidv4 } from 'uuid'

export class User {
    constructor(id, username, password) {
        this.id       = id
        this.username = username
        this.password = password
    }
    static createUniqueUser(username, password) {
        return new User(uuidv4(), username, password)
    }
}