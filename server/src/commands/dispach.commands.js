import { logDevError, logDevMessage } from "#services/logger.js"
import { COMMANDS } from "./commands.js"

export const DispachCommand = async (req, commandName, payload) => {
    const command = COMMANDS.get(commandName)

    if (!command) {
      logDevError(`Unknown command: ${commandName}`)
      throw new Error(`Unknown command: ${commandName}`)
    }
    if (typeof command !== 'function') {
      logDevError(`Command handler for ${commandName} is not a function`)
      throw new Error(`Command handler for ${commandName} is not a function`)
    }
    try {
      const result = command({
        req:     req, 
        payload: payload
      })
      if (result instanceof Promise) {
        return await result
      }
      return result
    }
    finally {
      logDevMessage(`Command ${commandName} has been dispatched.`)
    }
}