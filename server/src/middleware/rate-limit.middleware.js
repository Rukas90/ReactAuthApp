import { rateLimit } from 'express-rate-limit'

export const limitRateMiddleware = () => rateLimit({
    windowMs:        15 * 60 * 1000,
    limit:           10000,
    standardHeaders: 'draft-7',
    legacyHeaders:   false,
})