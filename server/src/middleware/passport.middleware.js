export const passportStrategyCallbackMiddleware = (error, user, info, res, next) => {
    if (error) {
        return res.status(500).json({ error: error.message })
    }
    if (!user) {
        return res.status(info.status).json({ error: info.error })
    }
    return next()
}