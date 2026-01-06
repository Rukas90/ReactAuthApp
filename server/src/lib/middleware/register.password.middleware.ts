import { ValidationError } from "#lib/common/domain.error.js"
import { validatePasswordStrength } from "#lib/util/password.strength.validator.js"
import { Request, Response, NextFunction } from "express"

export const validateRegisterPassword = (req: Request, _: Response, next: NextFunction) => {
    const { password, confirmPassword } = req.body

    if (!password || !confirmPassword) {
        throw new ValidationError('Password and confirm password are required.', 'PASSWORD_REQUIRED')
    }

    if (password !== confirmPassword) {
        throw new ValidationError('Password and confirm password do not match.', 'PASSWORD_MISMATCH')
    }
    const validation = validatePasswordStrength(password)

    if (!validation.ok) {
        throw validation.error
    }
    next()
}