import React, { createContext, useState, useContext, ReactNode } from "react"

// Enum for different types of messages.
export enum MessageType {
  Undefined,
  Success,
  Info,
  Error,
}

// Type definition for the context.
interface MessageContextType {
  message: string // The current message to be displayed.
  messageType: MessageType // The type of the current message.
  broadcastMessage: (message: string, type?: MessageType) => void // Function to broadcast a new message.
  clearMessage: () => void // Function to clear the current message.
}

// Creating a context for message broadcasting.
const MessageContext = createContext<MessageContextType | undefined>(undefined)

interface MessageProviderProps {
  children: ReactNode // Children elements of this provider.
}

// Custom hook to use the message context. Ensures that the context is used within its provider.
export const broadcast = (): MessageContextType => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider")
  }
  return context
}

// MessageProvider component to provide message context to its children.
export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [message, setMessage] = useState<string>("") // State to hold the current message.
  const [messageType, setMessageType] = useState<MessageType>(
    MessageType.Undefined // State to hold the current message type.
  )

  // Function to update the current message and its type.
  const broadcastMessage = (
    message: string,
    type: MessageType = MessageType.Undefined
  ) => {
    setMessage(message)
    setMessageType(type)
  }

  // Function to clear the current message.
  const clearMessage = () => {
    setMessage("")
    setMessageType(MessageType.Undefined)
  }

  // Value to be provided to the context.
  const contextValue = {
    message,
    messageType,
    broadcastMessage,
    clearMessage,
  }

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  )
}
