import nodemailer from 'nodemailer'
import { MailOptions } from './mailer.type'

export const transporter = nodemailer.createTransport({
    service: process.env.SENDER_MAIL_SERVICE,
    auth: {
        user: process.env.SENDER_EMAIL_ADDRESS,
        pass: process.env.SENDER_EMAIL_PASSWORD
    },
})
export const mail = async (options: MailOptions): Promise<void> => {
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL_ADDRESS,
        to: options.recipient,
        subject: options.subject,
        text: options.text,
        html: options.html
    })
}