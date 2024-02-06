import nodemailer from 'nodemailer'

export const mail = async (message) => {
    const options = {
        from:    process.env.SENDER_EMAIL_ADDRESS,
        to:      message.recipient,
        subject: message.subject,
        text:    message.body,
        html:    message.html
    }
    const transporter = createTransporter()

    try {
        await transporter.sendMail(options)
    }
    catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
    finally {
        transporter.close()
    }
    
}
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.SENDER_MAIL_SERVICE,
        auth: {
            user: process.env.SENDER_EMAIL_ADDRESS,
            pass: process.env.SENDER_EMAIL_PASSWORD
        },
    })
}