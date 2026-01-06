export type Success<T = void> = {
    ok: true
    data: T
}
export type Failure<E> = {
    ok: false
    error: E
}
export type Result<T = void, E = unknown> = Failure<E> | Success<T>

export const Result = {
    success<T>(data: T): Success<T> {
        return {
            ok: true,
            data,
        }
    },
    error<E>(error: E): Failure<E> {
        return {
            ok: false,
            error,
        }
    },
    match<T, E, R>(result: Result<T, E>, onSuccess: (data: T) => R, onFailure: (error: E) => R): R {
        return result.ok 
            ? onSuccess(result.data)
            : onFailure(result.error)
    },
    tap<T, E>(result: Result<T, E>, onSuccess: (data: T) => void, onFailure: (error: E) => void): void {
        return result.ok 
            ? onSuccess(result.data)
            : onFailure(result.error)
    }
}
export type VoidResult<E = unknown> = Result<void, E>

export const VoidResult = {
    ok:               () => Result.success<void>(undefined),
    error: <E>(error: E) => Result.error<E>(error)
}