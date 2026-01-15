import * as express from "express"
import { ProblemDetails } from "@project/shared"

export enum SuccessCode {
  Success = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
}

export type SuccessResponse<T> = {
  status: "success"
  data: T
}

declare global {
  namespace Express {
    interface Response {
      ok<T>(data: T, statusCode?: SuccessCode): Response
      problem(json: ProblemDetails): Response
    }
  }
}
