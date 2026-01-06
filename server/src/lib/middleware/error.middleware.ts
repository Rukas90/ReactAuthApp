import { DomainError } from "#lib/common/domain.error.js"
import { errorToProblemDetails } from "#lib/common/domain.error.mapper.js";
import { isDevelopment } from "#lib/util/app.util.js";
import { NextFunction, Request, Response } from "express";
import { ProblemDetails } from "src/types/express.response";

const INTERNAL_ERROR_DETAILS = (type: string, request: Request): ProblemDetails => {
    return {
        status: 500,
        type: type,
        title: 'Internal Error',
        detail: 'Unexpected internal error occured',
        code: 'INTERNAL_ERROR',
        instance: request.originalUrl
    }
}
export const endpointErrorHandler = (
    error: Error | unknown,
    request: Request,
    response: Response,
    _: NextFunction) => {
    if (!(error instanceof Error)) {
        return response.problem(INTERNAL_ERROR_DETAILS('unknown', request))
    }
    if (error instanceof DomainError) {
        return response.problem(errorToProblemDetails(error, isDevelopment(), request.originalUrl))
    }
    console.error('Unexpected error', error)

    return response.problem({
        ...INTERNAL_ERROR_DETAILS('internal-error', request),
        ...(isDevelopment() && { stack: error.stack })
    })
}