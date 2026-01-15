export type Success<T = void> = {
    ok: true;
    data: T;
};
export type Failure<E> = {
    ok: false;
    error: E;
};
export type Result<T = void, E = unknown> = Failure<E> | Success<T>;
export declare const Result: {
    success<T>(data: T): Success<T>;
    error<E>(error: E): Failure<E>;
    match<T, E, R>(result: Result<T, E>, onSuccess: (data: T) => R, onFailure: (error: E) => R): R;
    tap<T, E>(result: Result<T, E>, onSuccess: (data: T) => void, onFailure: (error: E) => void): void;
};
export type VoidResult<E = unknown> = Result<void, E>;
export declare const VoidResult: {
    ok: () => Success<void>;
    error: <E>(error: E) => Failure<E>;
};
