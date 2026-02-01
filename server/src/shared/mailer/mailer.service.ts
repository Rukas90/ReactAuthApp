import nodemailer from "nodemailer"
import { MailOptions } from "./mailer.type"
import type { Transporter } from "nodemailer"
import { VoidResult } from "@project/shared"
import logger from "../logger"

let transporter: Transporter | null = null

export const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.SENDER_MAIL_SERVICE,
      auth: {
        user: process.env.SENDER_EMAIL_ADDRESS,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    })
  }
  return transporter
}
export const send = async (
  options: MailOptions,
): Promise<VoidResult<Error>> => {
  try {
    await getTransporter().sendMail({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: options.recipient,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })
    return VoidResult.ok()
  } catch (error) {
    logger.error("Send mail failed. ", error)
    if (error instanceof Error) {
      return VoidResult.error(error)
    }
    return VoidResult.error(new Error("Email was not sent successfully."))
  }
}
const Mailer = {
  getTransporter,
  send,
}
export default Mailer
