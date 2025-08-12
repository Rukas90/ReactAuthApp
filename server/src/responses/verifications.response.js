export const sendEstablishedResponse = (id, message = 'Verification established') => (res) => {
  res
    .status(200)
    .json({ verificationId: id, message: message })
}