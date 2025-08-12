export const isAwaitableFunction = (func) =>
    typeof func === 'function' && func.constructor.name === 'AsyncFunction'

export const totalFuncParameterCount = (func) => func.length