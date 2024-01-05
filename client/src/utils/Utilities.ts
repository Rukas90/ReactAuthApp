export const HasLowercase = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[a-z]/.test(input)
}
export const HasUppercase = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[A-Z]/.test(input)
}
export const HasNumber = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[0-9]/.test(input)
}
export const HasSpecialCharacter = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[^A-Za-z0-9]/.test(input)
}
export const IsValidEmail = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(input)
}  