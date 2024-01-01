export const Lerp = (start, end, time) => {
    time = Clamp01(time)
    
    return (1.0 - time) * start + time * end
}
export const LerpUnclamped = (start, end, time) => {
    return (1.0 - time) * start + time * end
}
export const Clamp01 = (value) => {

    if (value > 1.0) value = 1.0
    if (value < 0.0) value = 0.0

    return value
}