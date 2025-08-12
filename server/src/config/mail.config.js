import nodemailer from 'nodemailer'

export const getTransporter = () => nodemailer.createTransport({
    service: process.env.SENDER_MAIL_SERVICE,
    auth: {
        user: process.env.SENDER_EMAIL_ADDRESS,
        pass: process.env.SENDER_EMAIL_PASSWORD
    },
})