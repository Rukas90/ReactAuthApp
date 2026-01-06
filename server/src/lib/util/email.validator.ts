import { ValidationError } from "#lib/common/domain.error.js"
import { VoidResult } from "#lib/common/result.js"

export const validateEmailAddress = (email: string): VoidResult<ValidationError> => {
    if (!email) {
        return VoidResult.error(new ValidationError(
            'Email is required.',
            'EMAIL_REQUIRED'))
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = pattern.test(email)

    return isValid
        ? VoidResult.ok()
        : VoidResult.error(new ValidationError(
            'Email is invalid.',
            'EMAIL_INVALID'))
}