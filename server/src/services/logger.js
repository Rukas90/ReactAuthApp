import { isCurrentEnv, development } from "#utils/env.util.js"

export const logDevMessage = (message, ...optionalParams) => {
    
    if (!isCurrentEnv(development)) {
        return
    }
    console.log(message, ...optionalParams)
}
export const logDevError = (message, ...optionalParams) => {
    
    if (!isCurrentEnv(development)) {
        return
    }
    console.error(message, ...optionalParams)
}
export const logMessage = (message, logMode = development, ...optionalParams) => {
    
    if (!isCurrentEnv(logMode)) {
        return
    }
    console.log(message, ...optionalParams)
}