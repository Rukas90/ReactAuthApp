import axios from 'axios'

export class Endpoints {
    constructor(server) {
        this.server = server

        this.#initialize()
    }
    #initialize() {
        this.server.app.get('/auth/status', (req, res) => {
            if (req.isAuthenticated()) {
                res.json({ authenticated: true })
            } else {
                res.json({ authenticated: false })
            }
        })
    }
}