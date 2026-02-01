import { domainErrorToProblemDetails, DomainError } from "@shared/errors"
import { config } from "@base/app"
import { NextFunction, Request, Response } from "express"
import { ProblemDetails } from "@project/shared"
import logger from "../logger"

const INTERNAL_ERROR_DETAILS = (
  type: string,
  request: Request,
): ProblemDetails => {
  return {
    status: 500,
    type: type,
    title: "Internal Error",
    detail: "Unexpected internal error occured",
    code: "INTERNAL_ERROR",
    instance: request.originalUrl,
  }
}
export const endpointErrorHandler = (
  error: Error | unknown,
  request: Request,
  response: Response,
  _: NextFunction,
) => {
  if (!(error instanceof Error)) {
    return response.problem(INTERNAL_ERROR_DETAILS("unknown", request))
  }
  if (error instanceof DomainError) {
    return response.problem(
      domainErrorToProblemDetails(
        error,
        config().isDevelopment,
        request.originalUrl,
      ),
    )
  }
  logger.error("Unexpected error", error)

  return response.problem({
    ...INTERNAL_ERROR_DETAILS("internal-error", request),
    ...(config().isDevelopment && { stack: error.stack }),
  })
}
