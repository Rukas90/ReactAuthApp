export const Result = {
    success(data) {
        return {
            ok: true,
            data,
        };
    },
    error(error) {
        return {
            ok: false,
            error,
        };
    },
    match(result, onSuccess, onFailure) {
        return result.ok ? onSuccess(result.data) : onFailure(result.error);
    },
    tap(result, onSuccess, onFailure) {
        return result.ok ? onSuccess(result.data) : onFailure(result.error);
    },
};
export const VoidResult = {
    ok: () => Result.success(undefined),
    error: (error) => Result.error(error),
};
