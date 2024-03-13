export type SucessResponse<T = any> = {
    success: true
    data: T
}
export type ErrorResponse = {
    success: false
    error: string
    status: number
}

export type Response<T = any> = SucessResponse<T> | ErrorResponse