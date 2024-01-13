import bcrypt from 'bcrypt'

export const get_auth_status = (req, res) => {
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
}

export const register_user = async (req, res, server) => {
    const email    = req.body.email;
    const password = req.body.password;

    const database = server.database;

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
}

export const verify_verification_code = async (req, res, server) => {
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
    const response = await server.database.fetch('verification_code', 'users', 'id', user.id)

    if (response.rowCount <= 0) {
        return res.status(404).json({ 
            message: "User verification code is not found!"
        })
    }
    const verification_code = response.rows[0].verification_code

    if (verification_code !== code) {
        return res.status(400).json({ message: 'Invalid verification code.' });
    }
    await server.database.updateUser(user.id, 'is_verified', true)

    user.is_verified = true

    return res.status(200).json({ message: 'Verification successful.' })
}

export const log_out_user = (req, res, server) => {
    req.logout(function(err) {
        if (err) { 
            console.error(err)
            return res.status(500).send("Error logging out")
        }
        if (req.session) {
            delete req.session.passport
        }
        server.syncCSRFSecret(req)

        return res
            .status(200)
            .cookie('X-CSRF-Token', server.tokens.create(req.session.csrfSecret), { httpOnly: true, sameSite: 'Lax' })
            .send("Logged out successfully")
    })
}