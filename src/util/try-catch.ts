type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];
type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

// Async function to try and catch an error
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const result = await promise;
    return [result, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}

export function tryCatchSync<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const result = fn();
    return [result, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
