import * as express from "express"
import { AuthResponseDto, ProblemDetails, SuccessCode } from "@project/shared"

declare global {
  namespace Express {
    interface Response {
      ok<T>(data: T, statusCode?: SuccessCode): Response
      auth(data: AuthResponseDto): Response
      problem(json: ProblemDetails): Response
    }
  }
}
