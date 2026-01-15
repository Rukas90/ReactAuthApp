import { appConfig } from "@base/app"
import { ProblemDetails } from "@project/shared"
import * as express from "express"
import { type Response } from "express-serve-static-core"
import { SuccessResponse, SuccessCode } from "src/types/express.response"

export function extendResponse() {
  express.response.ok = function <T>(
    data: T,
    statusCode: SuccessCode = 200
  ): express.Response {
    const response: SuccessResponse<T> = {
      status: "success",
      data: data,
    }
    return (this as Response).status(statusCode).json(response)
  }
  express.response.problem = function (
    details: ProblemDetails
  ): express.Response {
    return (this as Response)
      .status(details.status)
      .type("application/problem+json")
      .json({
        type: `urn:${process.env["APP_NAME"]}:problem:${details.type}`,
        title: details.title,
        status: details.status,
        detail: details.detail,
        code: details.code,
        instance: details.instance,
        ...(appConfig.isDevelopment && { stack: details.stack }),
      })
  }
}
