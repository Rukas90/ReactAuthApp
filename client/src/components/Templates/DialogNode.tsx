import React from "react"
import { DialogProps } from "../props/DialogProps"
import { useMediaQuery } from "react-responsive"

const DialogNode = ({
  id,
  title,
  message,
  showCancelBtn,
  confirmLabel,
  cancelLabel,
  onConfirmCallback,
  onCancelCallback,
}: { id: string } & DialogProps) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" })

  return (
    <div
      className={`overlay position-absolute top-0 left-0 d-flex flex-grow-1 w-100 h-100`}
      id={id}
    >
      <div className="d-flex position-relative w-100 h-100 justify-content-center align-items-end align-items-md-center p-md-4 p-0">
        <div
          className={`position-relative bg-dark overflow-hidden animate-pop-in ${
            isTabletOrMobile ? "rounded-top-3" : "rounded-3"
          }`}
          style={{
            maxWidth: "500px",
            width: "100%",
            minWidth: isTabletOrMobile ? "100%" : "425px",
          }} // Adjust minWidth for smaller screens if needed
        >
          <div className="bg-darker p-4 d-flex gap-4 flex-row justify-content-between align-items-center">
            <h5 className="text-light m-0 overflow-hidden">{title}</h5>
            <button
              type="button"
              className="dot-close-btn"
              onClick={onCancelCallback}
            ></button>
          </div>
          <div
            className="text-secondary p-4"
            style={{
              minHeight: "150px",
              maxHeight: "300px",
            }}
          >
            <p className="overflow-hidden m-0">{message}</p>
          </div>
          <div className="modal-footer d-flex justify-content-between bg-darker p-4">
            {showCancelBtn && !isTabletOrMobile && (
              <div className="col-12 col-md-auto">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancelCallback}
                >
                  {cancelLabel || "Cancel"}
                </button>
              </div>
            )}
            <div className="col-12 col-md-auto">
              <button
                type="button"
                className="btn btn-primary w-100 w-md-auto"
                onClick={onConfirmCallback}
              >
                {confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DialogNode
