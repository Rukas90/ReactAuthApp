/**
 * Linearly interpolates between two numbers.
 * 
 * @param {number} start - The start value.
 * @param {number} end - The end value.
 * @param {number} time - The interpolation factor between 0 and 1.
 * @returns {number} The interpolated value.
 */
export const Lerp = (start: number, end: number, time: number): number => {
    time = Clamp01(time)
    
    return (1.0 - time) * start + time * end
}

/**
 * Linearly interpolates between two numbers without clamping the interpolation factor.
 * 
 * @param {number} start - The start value.
 * @param {number} end - The end value.
 * @param {number} time - The interpolation factor (not necessarily between 0 and 1).
 * @returns {number} The interpolated value.
 */
export const LerpUnclamped = (start: number, end: number, time: number): number => {
    return (1.0 - time) * start + time * end
}

/**
 * Clamps a number to the range 0 to 1.
 * 
 * @param {number} value - The number to clamp.
 * @returns {number} The clamped value.
 */
export const Clamp01 = (value: number): number => {

    if (value > 1.0) value = 1.0
    if (value < 0.0) value = 0.0

    return value
}