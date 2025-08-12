export const timeExpired = (endDate) => {
    return endDate - new Date() <= 0
}