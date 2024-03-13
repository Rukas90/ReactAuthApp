import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ComponentType,
} from "react"
import { NotificationProps } from "Components/Props/NotificationProps"
import Notification from "Components/UI/Notification"

interface NotificationsContextState {
  createNotification: (notification: NotificationProps) => void
}

const NotificationsContext = createContext<NotificationsContextState>({
  createNotification: (_: NotificationProps) => {},
})

export const useNotificationsContext = () => useContext(NotificationsContext)

interface NotificationsProviderProps {
  children: React.ReactNode
}

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  interface NotificationData extends NotificationProps {
    id: number
    closing?: boolean
  }
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const removeNotification = useCallback((id: number) => {
    setNotifications((currentNotifications) => {
      // Find the notification index
      const index = currentNotifications.findIndex(
        (notification) => notification.id === id
      )

      if (index === -1) {
        return currentNotifications
      }
      const notification = currentNotifications[index]

      if (notification.closing) {
        return currentNotifications
      }
      const updatedNotifications = [...currentNotifications]
      updatedNotifications[index] = { ...notification, closing: true }

      setTimeout(() => {
        setNotifications((current) =>
          current.filter((notif) => notif.id !== id)
        )
      }, 150)

      return updatedNotifications
    })
  }, [])

  const createNotification = useCallback((notification: NotificationProps) => {
    const id = Date.now() + Math.round(10000 * Math.random())

    setNotifications((currentNotifications) => [
      ...currentNotifications,
      { id, ...notification },
    ])

    setTimeout(() => removeNotification(id), notification.lifespan || 2500)
  }, [])

  const renderer = () => {
    return (
      <div className="position-fixed end-0 top-0 p-4 d-flex flex-col transition-all gap-3">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            classes={
              notification.closing
                ? "animate-slide-off-right"
                : "animate-slide-left"
            }
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <NotificationsContext.Provider value={{ createNotification }}>
      {children}
      {renderer()}
    </NotificationsContext.Provider>
  )
}

// Higher-Order Wrapper Component

interface NotificationFunctions {
  create: (notification: NotificationProps) => void
  info: (message: LocalizableText) => void
  error: (message: LocalizableText) => void
  warning: (message: LocalizableText) => void
  success: (message: LocalizableText) => void
}
export interface WithNotificationsProps {
  notifications: NotificationFunctions
}

const withNotifications = <P extends WithNotificationsProps>(
  WrappedComponent: ComponentType<P>
) => {
  return (props: Omit<P, keyof WithNotificationsProps>) => {
    const { createNotification } = useNotificationsContext()

    const info = (message: LocalizableText) => {
      createNotification({
        type: "info",
        message,
      })
    }
    const error = (message: LocalizableText) => {
      createNotification({
        type: "error",
        message,
      })
    }
    const warning = (message: LocalizableText) => {
      createNotification({
        type: "warning",
        message,
      })
    }
    const success = (message: LocalizableText) => {
      createNotification({
        type: "success",
        message,
      })
    }

    const componentProps = {
      ...props,
      notifications: {
        create: createNotification,
        info,
        error,
        warning,
        success,
      },
    } as P
    return <WrappedComponent {...componentProps} />
  }
}

export default withNotifications
