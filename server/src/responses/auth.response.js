export const sendAuthResponse = (message) => (req, res) => {
  res
    .status(200)
    .cookie('X-CSRF-Token', req.app.locals.csrfTokens.create(req.session.csrfSecret), 
          { httpOnly: true, sameSite: process.env.SAME_SITE })
    .json({ message, redirectUrl: process.env.CLIENT_ORIGIN })
}
export const sendAuthRedirect = (redirect) => (req, res) => {
  res
    .status(200)
    .cookie('X-CSRF-Token', req.app.locals.csrfTokens.create(req.session.csrfSecret), 
          { httpOnly: true, sameSite: process.env.SAME_SITE })
    .redirect(redirect)
}