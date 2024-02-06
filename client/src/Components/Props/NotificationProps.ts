import { NotificationType } from "Utils/Types/NotificationType"

export type NotificationProps = {
    message: LocalizableText
    type?: NotificationType
    lifespan?: number
}