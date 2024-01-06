import bcrypt from 'bcrypt'
import passport from 'passport'

export class Endpoints {
    constructor(server) {
        this.server = server

        this.#initialize()
    }
    #initialize() {
        this.server.app.get('/auth/status', (req, res) => {
            if (req.isAuthenticated()) {        
                const user       = req.user
                const isVerified = user.is_verified
                
                res.json({ 
                    authenticated: true, 
                    isVerified: isVerified 
                })
            } else {
                res.json({ authenticated: false })
            }
        })
        this.server.app.post('/auth/register', async (req, res) => {
            const email    = req.body.email;
            const password = req.body.password;
 
            const database = this.server.database;
        
            try {
                const user = await database.query('SELECT * FROM users WHERE email = $1', [email])
        
                if (user.rowCount > 0) {
                    return res.status(409).send('User already exists')
                }
                const salt           = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password + process.env.PEPPER_KEY, salt)
        
                await database.createUser(email, hashedPassword)
                        
                res.status(200).send('User registered successfully');
            } catch (err) {
                console.error('Error during registration:', err)
                res.status(500).send('Internal Server Error')
            }
        })
        this.server.app.post('/auth/login', passport.authenticate('local'), async (req, res) => {
            res.status(200).send('Logged in successfully');
        })
        this.server.app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
        this.server.app.get('/auth/google/register', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

        this.server.app.get('/auth/google/callback', passport.authenticate('google', 
            { failureRedirect: '/login' }), (req, res) => {

            res.redirect('http://localhost:5173/')
        })

        this.server.app.post('/auth/verify', async (req, res) => {
            const code = req.body.code
            const user = req.user

            if (!req.isAuthenticated()) {
                return res.status(401).json({
                    message: "User is not logged in!"
                })
            }
            if (!user) {
                return res.status(404).json({ 
                    message: "User is not found!"
                })
            }
            if (user.verification_code !== code) {
                return res.status(400).json({ message: 'Invalid verification code.' });
            }
            await this.server.database.updateUser(user.id, 'is_verified', true);

            req.user.is_verified = true;

            return res.status(200).json({ message: 'Verification successful.' });
        })
        this.server.app.post('/auth/logout', (req, res) => {
            req.logout(function(err) {
                if (err) { 
                    console.error(err); 
                    return res.status(500).send("Error logging out");
                }
                if (req.session) {
                    delete req.session.passport;
                }
                return res.status(200).send("Logged out successfully");
            })
        });
    }
}

