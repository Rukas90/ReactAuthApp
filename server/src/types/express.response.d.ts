import * as express from "express"
import { ProblemDetails, SuccessCode } from "@project/shared"

declare global {
  namespace Express {
    interface Response {
      ok<T>(data: T, statusCode?: SuccessCode): Response
      problem(json: ProblemDetails): Response
    }
  }
}
