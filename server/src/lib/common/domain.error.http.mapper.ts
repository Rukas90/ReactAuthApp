import { ProblemDetails } from "src/types/express.response"
import * as DE from "#lib/common/domain.error"

type ProblemDescriptor = {
  status: number
  title: string
  type: string
}
export const errorToProblemDetails = (
  error: DE.DomainError,
  useStack: boolean,
  requestInstance: string
): ProblemDetails => {
  return {
    ...ERROR_DESCRIPTORS[error.type],
    detail: error.message,
    code: error.code,
    instance: requestInstance,
    ...(useStack && { stack: error.stack }),
  }
}
const ERROR_DESCRIPTORS: Record<DE.DomainErrorType, ProblemDescriptor> = {
  [DE.DomainErrorType.INVALID_OPERATION]: {
    status: 400,
    title: "Invalid request",
    type: "invalid-operation",
  },
  [DE.DomainErrorType.ACCESS_DENIED]: {
    status: 401,
    title: "Authentication required",
    type: "access-denied",
  },
  [DE.DomainErrorType.ACCESS_FORBIDDEN]: {
    status: 403,
    title: "Access forbidden",
    type: "access-forbidden",
  },
  [DE.DomainErrorType.RESOURCE_MISSING]: {
    status: 404,
    title: "Resource not found",
    type: "resource-missing",
  },
  [DE.DomainErrorType.OPERATION_TIMEOUT]: {
    status: 408,
    title: "Request timeout",
    type: "request-timeout",
  },
  [DE.DomainErrorType.CONFLICT]: {
    status: 409,
    title: "Concurrency conflict",
    type: "concurrency-conflict",
  },
  [DE.DomainErrorType.VALIDATION]: {
    status: 422,
    title: "Validation failed",
    type: "validation-error",
  },
  [DE.DomainErrorType.UNPROCESSABLE_CONTENT]: {
    status: 422,
    title: "Unprocessable entity",
    type: "unprocessable-entity",
  },
  [DE.DomainErrorType.RATE_LIMIT]: {
    status: 429,
    title: "Too many requests",
    type: "rate-limit-exceeded",
  },
  [DE.DomainErrorType.UNEXPECTED]: {
    status: 500,
    title: "Unexpected server error",
    type: "unexpected-state",
  },
}
