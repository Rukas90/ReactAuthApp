export const getCspConfigMiddleware = () => (_, res, next) => {
    // Content Security Policy (CSP) configuration ...
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; img-src 'self' ${process.env.CLIENT_ORIGIN}; script-src 'self' ${process.env.CLIENT_ORIGIN}; style-src 'self' ${process.env.CLIENT_ORIGIN};`
    )
    next()
}