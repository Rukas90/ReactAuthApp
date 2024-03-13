import Dialog from "Components/UI/Dialog";

/**
 * DialogManager Class
 * Manages a collection of Dialog instances, handling their lifecycle and visibility.
 * It acts as a central manager for all dialog components within the application.
 */
class DialogManager {
  // Map to hold instances of Dialogs, keyed by their unique IDs
  protected instances: Map<string, Dialog> = new Map<string, Dialog>()
  // ID of the currently targeted (active) Dialog
  protected targetID: string = ''

  /**
    * Adds a new Dialog instance to the manager.
    * If this is the first Dialog being added, it automatically becomes the target.
    *
    * @param {Dialog} dialog - The Dialog instance to be added.
  */
  Add(dialog: Dialog) { 
    const id = dialog.GetID()

    this.instances.set(id, dialog)
    
    // Automatically target the first added Dialog
    if (this.Count() === 1) {
      this.targetID = id
    }
  }

  /**
    * Moves to the next Dialog in the collection, if any.
    * The current target Dialog is removed, and the next one becomes the new target.
  */
  Next() {
    if (this.targetID) {
      // Remove the current target Dialog
      this.instances.delete(this.targetID)
    }
    if (this.Count() < 1) {
      return
    }
    // Set the next Dialog as the new target
    const id = this.instances.keys().next().value
    const dialog = this.instances.get(id)

    this.targetID = id

    // Recursive call in case the next Dialog is undefined
    if (!dialog) {
      this.Next()
    }
  }

  /**
    * Returns the number of Dialog instances currently managed.
    *
    * @returns {number} The count of Dialog instances.
  */
  Count() : number {
      return this.instances.size
  }

  /**
    * Returns the ID of the current target Dialog.
    *
    * @returns {string} The ID of the target Dialog.
  */
  TargetID() : string {
      return this.targetID
  }

  /**
    * Retrieves a Dialog instance by its ID.
    *
    * @param {string} id - The ID of the Dialog to retrieve.
    * @returns {Dialog | undefined} The Dialog instance, if found; otherwise, undefined.
  */
  GetDialog(id: string) : Dialog | undefined {
      return this.instances.get(id)
  }
}
export default DialogManager