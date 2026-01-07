export type SuccessResponse<T> = {
  status: "success"
  data: T
}
export type ProblemDetails = {
  type: string
  title: string
  status: number
  detail: string
  code: string
  instance: string
  stack?: string
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ProblemDetails }
