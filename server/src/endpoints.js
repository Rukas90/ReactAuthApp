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
        this.server.app.get('/session/lang', (req, res) => {
            res.json( { language : req.session.language || 'en' } );
        })
        this.server.app.put('/session/lang', (req, res) => {
            req.session.language = req.body.language;
            res.send('Language updated');
        })
    }
}