export interface Response<T = any> {
    success?: boolean
    error?: string
    data?: T
    status?: number
}