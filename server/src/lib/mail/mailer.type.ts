import Mail, { Address, AttachmentLike } from "nodemailer/lib/mailer";
import { Readable } from "nodemailer/lib/xoauth2";

export type MailOptions = {
    recipient: string | Address,
    subject: string,
    text?: string | Buffer | Readable | AttachmentLike
    html?: string | Buffer | Readable | AttachmentLike

}