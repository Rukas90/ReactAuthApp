import { type ProblemDetails } from "@project/shared"

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ProblemDetails }
