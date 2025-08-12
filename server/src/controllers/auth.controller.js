/**
 * Retrieves the authentication status of the current user.
 * 
 * @param {object} req - The request object containing user information and session data.
 * @param {object} res - The response object used to return the authentication status.
 * @returns The authentication status of the user.
*/
export const getAuthStatus = (req, res) => {
    const authenticated = req.isAuthenticated()
    const user          = authenticated ? req.user : null
    const isVerified    = user ? user.is_verified : false
    const authMode      = req.session.AuthentificationState

    return res.json({
        isAuthenticated: authenticated,
        isVerified:      isVerified,
        mode:            authMode ?? 0,
        user: user ? {
            id: user.id
        } : null
    })
}