import path              from 'path'
import { fileURLToPath } from 'url'

export const production  = 'production'
export const development = 'development'
export const testing     = 'testing'

export const getNodeEnv = () => process.env.NODE_ENV?.trim().toLowerCase() || development

export const isProduction  = () => getNodeEnv() === production
export const isDevelopment = () => getNodeEnv() === development
export const isTesting     = () => getNodeEnv() === testing

export const isCurrentEnv = (nodeEnv) => getNodeEnv() === nodeEnv

export const rootPath = path.dirname(fileURLToPath(import.meta.url))
export const cookieMaxAge = 365 * 24 * 60 * 60 * 1000