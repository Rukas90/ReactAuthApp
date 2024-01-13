export const MobileMediaQuery = {
    query: "(max-width: 640px)"
}

/**
 * HasLowercase
 * Checks if the input string contains at least one lowercase character.
 *
 * @param {string} input - The string to be checked.
 * @returns {boolean} True if the input contains a lowercase character, false otherwise.
*/
export const HasLowercase = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[a-z]/.test(input)
}
/**
 * HasUppercase
 * Checks if the input string contains at least one uppercase character.
 *
 * @param {string} input - The string to be checked.
 * @returns {boolean} True if the input contains an uppercase character, false otherwise.
*/
export const HasUppercase = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[A-Z]/.test(input)
}
/**
 * HasNumber
 * Checks if the input string contains at least one numeric character.
 *
 * @param {string} input - The string to be checked.
 * @returns {boolean} True if the input contains a number, false otherwise.
*/
export const HasNumber = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[0-9]/.test(input)
}
/**
 * HasSpecialCharacter
 * Checks if the input string contains at least one special character.
 * Special characters are any characters that are not letters or numbers.
 *
 * @param {string} input - The string to be checked.
 * @returns {boolean} True if the input contains a special character, false otherwise.
*/
export const HasSpecialCharacter = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /[^A-Za-z0-9]/.test(input)
}
/**
 * IsValidEmail
 * Checks if the input string is a valid email format.
 *
 * @param {string} input - The string to be checked.
 * @returns {boolean} True if the input is in a valid email format, false otherwise.
*/
export const IsValidEmail = (input: string): boolean => {
    if (!input || input.trim() === "") {
        return false
    }
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(input)
}