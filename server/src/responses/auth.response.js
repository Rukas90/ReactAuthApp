export const sendAuthResponse = (message, redirect) => (req, res) => {
  res
    .status(200)
    .cookie('X-CSRF-Token', req.app.locals.csrfTokens.create(req.session.csrfSecret), 
          { httpOnly: true, sameSite: process.env.SAME_SITE })
    .json({ message, redirect: redirect })
}
export const sendAuthRedirect = (redirect) => (req, res) => {
  res
    .status(200)
    .cookie('X-CSRF-Token', req.app.locals.csrfTokens.create(req.session.csrfSecret), 
          { httpOnly: true, sameSite: process.env.SAME_SITE })
    .redirect(redirect)
}