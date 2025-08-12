import { getTransporter } from '#config/mail.config.js'

export const mail = async (message) => {
    const options = {
        from:    process.env.SENDER_EMAIL_ADDRESS,
        to:      message.recipient,
        subject: message.subject,
        text:    message.body,
        html:    message.html
    }
    const transporter = getTransporter()

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
