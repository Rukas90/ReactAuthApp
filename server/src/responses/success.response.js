export const sendGenericSuccessResponse = (message) => (res) => {
    return res.status(200).json({ message })
}
export const sendRedirectSuccessResponse = (redirect) => (res) => {
    return res.status(200).redirect(redirect)
}