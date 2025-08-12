export const syncCSRFSecret = (req) => {
    if (req.session && req.session.csrfSecret) {
        return
    }
    const tokens = req.app.locals.csrfTokens
    const secret = tokens.secretSync()
    
    req.session.csrfSecret = secret
}