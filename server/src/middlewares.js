export const validateAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}