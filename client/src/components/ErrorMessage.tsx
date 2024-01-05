import React from "react"
import Message from "./Message"

const ErrorMessage = ({ header, content }: MessageProps) => {
  return <Message header={header} content={content} bgColor="error" />
}
export default ErrorMessage
