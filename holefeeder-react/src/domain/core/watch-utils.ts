import { Result } from './result';

type Watcher<T> = (onDataChange: (result: Result<T>) => void) => () => void;

export const combineWatchers = <T extends any[], R>(watchers: { [K in keyof T]: Watcher<T[K]> }, selector: (...args: T) => R): Watcher<R> => {
  return (onDataChange: (result: Result<R>) => void) => {
    const values: Result<any>[] = new Array(watchers.length).fill(Result.loading());
    const hasEmitted = new Array(watchers.length).fill(false);
    const unsubscribes: (() => void)[] = [];

    const emit = () => {
      // If not all watchers have emitted at least once, stay loading
      if (hasEmitted.some((emitted) => !emitted)) {
        onDataChange(Result.loading());
        return;
      }

      // Check for failures
      const errors: string[] = [];
      let isFailure = false;
      for (const res of values) {
        if (res.isFailure) {
          isFailure = true;
          if (res.errors) {
            errors.push(...res.errors);
          }
          // If strict failure is needed immediately, break here.
          // Often aggregating errors is nice.
        }
      }
      if (isFailure) {
        onDataChange(Result.failure(errors));
        return;
      }

      // Check for loading
      if (values.some((res) => res.isLoading)) {
        onDataChange(Result.loading());
        return;
      }

      // All success
      try {
        // At this point we know all are success because !isFailure and !isLoading
        // But Typescript might not narrow array elements automatically without help.
        const successValues = values.map((res) => (res as any).value);
        const result = selector(...(successValues as T));
        onDataChange(Result.success(result));
      } catch (e: any) {
        onDataChange(Result.failure([e.message || 'Error in selector']));
      }
    };

    watchers.forEach((watcher, index) => {
      const unsub = watcher((result) => {
        values[index] = result;
        hasEmitted[index] = true;
        emit();
      });
      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  };
};
