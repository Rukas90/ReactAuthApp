export const sendErrorResponse = (status, message) => (res) => {
    return res.status(status).json({ error: message, success: false })
}