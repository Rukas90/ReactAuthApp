import React, { createContext, useContext, useState, useCallback } from "react"
import Dialog from "Components/Dialog"
import { DialogProps } from "Components/Props/DialogProps"
import DialogManager from "Utils/DialogManager"

// Type definition for the dialog context
interface DialogContextType {
  showDialog: (options: DialogProps) => void
  hideDialog: () => void
}

// Creating the dialog context
const DialogContext = createContext<DialogContextType | undefined>(undefined)

// Custom hook for using the dialog context
export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    // Ensuring the hook is used within a DialogProvider
    throw new Error("useDialog must be used within a DialogProvider")
  }
  return context
}

/**
 * DialogProvider Component
 * Provides a context for managing dialogs throughout the application.
 * This component manages the state and lifecycle of dialogs using a DialogManager.
 *
 * - showDialog: Function to show a new dialog based on provided DialogProps.
 * - hideDialog: Function to hide the currently displayed dialog.
 */
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for the DialogManager instance
  const [dialogManager] = useState(new DialogManager())
  // State for the current dialog node
  const [dialogNode, setDialogNode] = useState<React.ReactNode | null>(null)

  // Function to update the current dialog based on the DialogManager state
  const updateDialog = () => {
    const targetID = dialogManager.TargetID()

    if (!targetID) {
      setDialogNode(null)
    } else {
      setDialogNode(dialogManager.GetDialog(targetID)?.CreateNode())
    }
  }

  // Function to show a dialog
  const showDialog = useCallback(
    (options: DialogProps) => {
      const dialogOptions = {
        ...options,
        onCancelCallback: () => {
          options.onCancelCallback?.()
          hideDialog()
        },
        onConfirmCallback: () => {
          options.onConfirmCallback?.()
          hideDialog()
        },
      }
      const newDialog = new Dialog(dialogOptions)
      dialogManager.Add(newDialog)

      updateDialog()
    },
    [dialogManager, updateDialog]
  )

  // Function to hide the current dialog
  const hideDialog = useCallback(() => {
    dialogManager.Next()

    updateDialog()
  }, [dialogManager, updateDialog])

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {dialogNode}
    </DialogContext.Provider>
  )
}
