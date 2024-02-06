import React, { ReactNode } from "react"
import { DialogProps } from "./Props/DialogProps"
import { v4 as uuidv4 } from "uuid"
import DialogNode from "Components/Templates/Dialog/DialogNode"

/**
 * Dialog Class
 * Represents a dialog component with customizable properties and render logic.
 * Each dialog has a unique ID and can display a title, message, and action buttons.
 */
export class Dialog {
  protected id: string = "" // Unique identifier for the dialog
  protected props: DialogProps = {
    // Default properties for the dialog
    title: Localized("NO_TITLE"),
    message: Localized("NO_MESSAGE"),
    showCancelBtn: true,
    confirmLabel: "Ok",
    cancelLabel: "Cancel",
    onCancelCallback: () => {},
    onConfirmCallback: () => {},
  }

  /**
   * Constructor for the Dialog class.
   * Initializes the dialog with custom properties and binds callbacks.
   *
   * @param {DialogProps} props - Custom properties for the dialog.
   */
  constructor(props: DialogProps) {
    this.id = uuidv4() // Generate a unique ID for each dialog
    this.props = {
      ...props,
      // Bind the onCancel and onConfirm callbacks to the dialog instance
      onCancelCallback: props.onCancelCallback
        ? props.onCancelCallback.bind(this)
        : () => {},
      onConfirmCallback: props.onConfirmCallback
        ? props.onConfirmCallback.bind(this)
        : () => {},
    }
  }

  /**
   * Get the unique ID of the dialog.
   * @returns {string} The unique ID.
   */
  GetID = (): string => this.id
  /**
   * Get the properties of the dialog.
   * @returns {DialogProps} The dialog properties.
   */
  GetProps = (): DialogProps => this.props

  /**
   * Creates the React node for the dialog.
   * Defines the structure and styling of the dialog's UI.
   * @returns {ReactNode} The rendered dialog component.
   */
  CreateNode = (): ReactNode => (
    <>
      <DialogNode id={this.id} {...this.props} />
    </>
  )
}
export default Dialog
