import { ValidationError } from "#lib/common/domain.error.js"
import { VoidResult } from "#lib/common/result.js"

type PasswordRule = {
    name: string
    code: string
    message: string
    validate: (password: string) => boolean
}
const PASSWORD_RULES: PasswordRule[] = [
    {
        name: "length",
        code: "PASSWORD_LENGTH",
        message: "Password must be between 8 and 42 characters.",
        validate: (p) => p.length >= 8 && p.length <= 42
    },
    {
        name: "lowercase",
        code: "PASSWORD_LOWERCASE",
        message: "Password must contain at least one lowercase letter.",
        validate: (p) => /[a-z]/.test(p)
    },
    {
        name: "uppercase",
        code: "PASSWORD_UPPERCASE",
        message: "Password must contain at least one uppercase letter.",
        validate: (p) => /[A-Z]/.test(p)
    },
    {
        name: "number",
        code: "PASSWORD_NUMBER",
        message: "Password must contain at least one number.",
        validate: (p) => /\d/.test(p)
    },
    {
        name: "special",
        code: "PASSWORD_SPECIAL",
        message: "Password must contain at least one special character.",
        validate: (p) => /[^A-Za-z0-9]/.test(p)
    }
]
export const validatePasswordStrength = (password: string): VoidResult<ValidationError> => {
    for (const rule of PASSWORD_RULES) {
        if (!rule.validate(password)) {
            return VoidResult.error(
                new ValidationError(rule.message, rule.code))
        }
    }
    return VoidResult.ok()
}