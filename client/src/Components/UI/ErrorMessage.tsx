import React from "react"
import Message from "./Message"
import ErrorIcon from 'Img/Icons/Common/error.svg'

const ErrorMessage = ({ header, content }: MessageProps) => {
  return <Message header={header} content={content} bgColor="error" icon={ErrorIcon} />
}
export default ErrorMessage
