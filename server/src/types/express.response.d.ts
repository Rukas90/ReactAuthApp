import * as express from "express"

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

export type ProblemDetails = {
  type: string
  title: string
  status: number
  detail: string
  code: string
  instance: string
  stack?: string
}
