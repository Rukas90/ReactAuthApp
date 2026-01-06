import { asyncRoute } from "#lib/util/express.error.handler.js"
import { NextFunction, Request, Response } from "express"
import { validateEmailAddress } from "#lib/util/email.validator.js"

export const validateRegisterEmail = asyncRoute(
    async(req: Request, _: Response, next: NextFunction) => 
{
    const validation = validateEmailAddress(req.body.email)

    if (!validation.ok) {
        throw validation.error
    }
    next()
})