import { NotificationType } from "Data/NotificationType"

export type NotificationProps = {
    message: LocalizableText
    type?: NotificationType
    lifespan?: number
}