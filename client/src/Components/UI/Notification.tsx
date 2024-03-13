import React from "react"
import ErrorIcon from "Img/Icons/Common/error.svg"
import { NotificationType } from "Data/NotificationType"

interface Props {
  message: LocalizableText
  type?: NotificationType
  classes?: string
  onClose: () => void
}

const Notification = ({
  message,
  type = "warning",
  classes,
  onClose,
}: Props) => {
  return (
    <div
      className={`backdrop-blur rounded overflow-hidden ${classes} transition-all`}
    >
      <div
        className={`notification-${type} notification d-flex position-relative`}
      >
        <img src={ErrorIcon} className="icon my-auto ms-3" />
        <div className="position-relative ps-3 pe-4 py-2 d-flex flex-col w-100">
          <span className="fw-semibold capitalize">{type}</span>
          <span className="fs-7">{Translate(message)}</span>
          <div className="position-absolute top-0 end-0 p-1">
            <button
              className="notification-close-btn btn-close"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Notification
