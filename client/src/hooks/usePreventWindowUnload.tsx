import { useEffect } from "react"
import { useBusyContext } from "Contexts/BusyProvider"

/**
 * usePreventWindowUnload Custom Hook
 *
 * Prevents the window from unloading (navigating away, closing tab) when the app is in a 'busy' state.
 * This is typically used to prevent data loss in case of unsaved changes.
 */
export const usePreventWindowUnload = () => {
  const { isBusy } = useBusyContext() // Accessing the busy state from BusyContext

  useEffect(() => {
    // Event handler to prompt the user before unloading the window
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isBusy()) {
        // Custom message for the user, warning about unsaved changes
        const message =
          "You have unsaved changes. Are you sure you want to leave?"
        event.returnValue = message // Standard way to trigger the browser's built-in navigation confirmation dialog
        return message
      }
    }

    // Adding the event listener for the 'beforeunload' event
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isBusy]) // Dependency array with isBusy to re-run the effect when isBusy state changes
}
