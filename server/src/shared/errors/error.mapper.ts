import { DomainError } from "./domain.error.base"
import { DomainErrorType } from "./domain.error.type"
import { ProblemDetails } from "@project/shared"

type ProblemDescriptor = {
  status: number
  title: string
  type: string
}

const ERROR_DESCRIPTORS: Record<DomainErrorType, ProblemDescriptor> = {
  [DomainErrorType.INVALID_OPERATION]: {
    status: 400,
    title: "Invalid request",
    type: "invalid-operation",
  },
  [DomainErrorType.ACCESS_DENIED]: {
    status: 401,
    title: "Authentication required",
    type: "access-denied",
  },
  [DomainErrorType.ACCESS_FORBIDDEN]: {
    status: 403,
    title: "Access forbidden",
    type: "access-forbidden",
  },
  [DomainErrorType.RESOURCE_MISSING]: {
    status: 404,
    title: "Resource not found",
    type: "resource-missing",
  },
  [DomainErrorType.OPERATION_TIMEOUT]: {
    status: 408,
    title: "Request timeout",
    type: "request-timeout",
  },
  [DomainErrorType.CONFLICT]: {
    status: 409,
    title: "Concurrency conflict",
    type: "concurrency-conflict",
  },
  [DomainErrorType.VALIDATION]: {
    status: 422,
    title: "Validation failed",
    type: "validation-error",
  },
  [DomainErrorType.UNPROCESSABLE_CONTENT]: {
    status: 422,
    title: "Unprocessable entity",
    type: "unprocessable-entity",
  },
  [DomainErrorType.RATE_LIMIT]: {
    status: 429,
    title: "Too many requests",
    type: "rate-limit-exceeded",
  },
  [DomainErrorType.UNEXPECTED]: {
    status: 500,
    title: "Unexpected server error",
    type: "unexpected-state",
  },
}

export function domainErrorToProblemDetails(
  error: DomainError,
  useStack: boolean,
  instance: string
): ProblemDetails {
  return {
    ...ERROR_DESCRIPTORS[error.type],
    detail: error.message,
    code: error.code,
    instance,
    ...(useStack && { stack: error.stack }),
  }
}
