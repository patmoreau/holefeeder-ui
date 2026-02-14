import { type Failure, Result, type Success } from './result';

describe('Result', () => {
  describe('success', () => {
    it('should create a success result with a value', () => {
      const result = Result.success(42);

      expect(result.isFailure).toBe(false);
      expect(result.isLoading).toBe(false);
      expect((result as Success<number>).value).toBe(42);
    });

    it('should create a success result with a string value', () => {
      const result = Result.success('test');

      expect(result.isFailure).toBe(false);
      expect(result.isLoading).toBe(false);
      expect((result as Success<string>).value).toBe('test');
    });

    it('should create a success result with an object value', () => {
      const obj = { name: 'John', age: 30 };
      const result = Result.success(obj);

      expect(result.isFailure).toBe(false);
      expect(result.isLoading).toBe(false);
      expect((result as Success<typeof obj>).value).toEqual(obj);
    });

    it('should create a success result with null', () => {
      const result = Result.success(null);

      expect(result.isFailure).toBe(false);
      expect(result.isLoading).toBe(false);
      expect((result as Success<null>).value).toBeNull();
    });

    it('should create a success result with undefined', () => {
      const result = Result.success(undefined);

      expect(result.isFailure).toBe(false);
      expect(result.isLoading).toBe(false);
      expect((result as Success<undefined>).value).toBeUndefined();
    });

    it('should create a success result with void using no arguments', () => {
      const result = Result.success();

      expect(result.isFailure).toBe(false);
      expect(result.isLoading).toBe(false);
      expect((result as Success<void>).value).toBeUndefined();
    });

    it('should infer Result<void> type when called without arguments', () => {
      const voidFunction = (): Result<void> => {
        return Result.success();
      };

      const result = voidFunction();
      expect(result.isFailure).toBe(false);
      expect((result as Success<void>).value).toBeUndefined();
    });
  });

  describe('failure', () => {
    it('should create a failure result with a single error', () => {
      const result = Result.failure(['Error message']);

      expect(result.isFailure).toBe(true);
      expect(result.isLoading).toBe(false);
      expect((result as Failure).errors).toEqual(['Error message']);
    });

    it('should create a failure result with multiple errors', () => {
      const errors = ['Error 1', 'Error 2', 'Error 3'];
      const result = Result.failure(errors);

      expect(result.isFailure).toBe(true);
      expect(result.isLoading).toBe(false);
      expect((result as Failure).errors).toEqual(errors);
    });

    it('should create a failure result with an empty error array', () => {
      const result = Result.failure([]);

      expect(result.isFailure).toBe(true);
      expect(result.isLoading).toBe(false);
      expect((result as Failure).errors).toEqual([]);
    });
  });

  describe('loading', () => {
    it('should create a loading result', () => {
      const result = Result.loading();

      expect(result.isLoading).toBe(true);
      expect(result.isFailure).toBe(false);
    });
  });

  describe('combine', () => {
    it('should combine multiple successful results into one', () => {
      const results = {
        name: Result.success('John'),
        age: Result.success(30),
        active: Result.success(true),
      };

      const combined = Result.combine(results);

      expect(combined).toBeSuccessWithValue({
        name: 'John',
        age: 30,
        active: true,
      });
    });

    it('should return failure when one result fails', () => {
      const results = {
        name: Result.success('John'),
        age: Result.failure(['Age is required']),
        active: Result.success(true),
      };

      const combined = Result.combine(results);

      expect(combined).toBeFailureWithErrors(['Age is required']);
    });

    it('should combine all errors when multiple results fail', () => {
      const results = {
        name: Result.failure(['Name is required']),
        age: Result.failure(['Age is required', 'Age must be positive']),
        active: Result.success(true),
      };

      const combined = Result.combine(results);

      expect(combined).toBeFailureWithErrors(['Name is required', 'Age is required', 'Age must be positive']);
    });

    it('should return loading when one result loads', () => {
      const results = {
        name: Result.success('John'),
        age: Result.failure(['Age is required']),
        active: Result.loading(),
      };

      const combined = Result.combine(results);

      expect(combined).toBeLoading();
    });

    it('should handle empty object', () => {
      const results = {};

      const combined = Result.combine(results);

      expect(combined).toBeSuccessWithValue({});
    });

    it('should combine results with complex types', () => {
      const results = {
        user: Result.success({ id: 1, name: 'John' }),
        items: Result.success([1, 2, 3]),
        metadata: Result.success({ count: 3, page: 1 }),
      };

      const combined = Result.combine(results);

      expect(combined).toBeSuccessWithValue({
        user: { id: 1, name: 'John' },
        items: [1, 2, 3],
        metadata: { count: 3, page: 1 },
      });
    });
  });

  describe('combineArray', () => {
    it('should combine an array of successful results', () => {
      const results = [Result.success(1), Result.success(2), Result.success(3)];

      const combined = Result.combineArray(results);

      expect(combined.isFailure).toBe(false);
      expect((combined as Success<number[]>).value).toEqual([1, 2, 3]);
    });

    it('should return failure when one result fails', () => {
      const results = [Result.success(1), Result.failure(['Error occurred']), Result.success(3)];

      const combined = Result.combineArray(results);

      expect(combined.isFailure).toBe(true);
      expect((combined as Failure).errors).toEqual(['Error occurred']);
    });

    it('should return loading when one result loads', () => {
      const results = [Result.success(1), Result.failure(['Error occurred']), Result.loading()];

      const combined = Result.combineArray(results);

      expect(combined).toBeLoading();
    });

    it('should combine all errors when multiple results fail', () => {
      const results = [Result.failure(['Error 1']), Result.success(2), Result.failure(['Error 2', 'Error 3'])];

      const combined = Result.combineArray(results);

      expect(combined).toBeFailureWithErrors(['Error 1', 'Error 2', 'Error 3']);
    });

    it('should handle empty array', () => {
      const results: Result<number>[] = [];

      const combined = Result.combineArray(results);

      expect(combined).toBeSuccessWithValue([]);
    });

    it('should combine results with different types', () => {
      const results = [Result.success('a'), Result.success('b'), Result.success('c')];

      const combined = Result.combineArray(results);

      expect(combined).toBeSuccessWithValue(['a', 'b', 'c']);
    });

    it('should combine results with complex objects', () => {
      const results = [
        Result.success({ id: 1, name: 'Alice' }),
        Result.success({ id: 2, name: 'Bob' }),
        Result.success({ id: 3, name: 'Charlie' }),
      ];

      const combined = Result.combineArray(results);

      expect(combined).toBeSuccessWithValue([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });
  });

  describe('type guards', () => {
    it('should allow type narrowing based on isFailure property', () => {
      const successResult: Result<number> = Result.success(42);
      const failureResult: Result<number> = Result.failure(['Error']);

      if (!successResult.isFailure) {
        // TypeScript should infer this as Success<number>
        expect(successResult.value).toBe(42);
      }

      if (failureResult.isFailure) {
        // TypeScript should infer this as Failure
        expect(failureResult.errors).toEqual(['Error']);
      }
    });
  });

  describe('isSuccess', () => {
    it('should return true for successful result', () => {
      const result = Result.success(42);

      expect(Result.isSuccess(result)).toBe(true);
    });

    it('should return false for failure result', () => {
      const result = Result.failure(['Error']);

      expect(Result.isSuccess(result)).toBe(false);
    });

    it('should return false for loading result', () => {
      const result = Result.loading();

      expect(Result.isSuccess(result)).toBe(false);
    });

    it('should narrow type to Success when true', () => {
      const result: Result<number> = Result.success(42);

      if (Result.isSuccess(result)) {
        // TypeScript should know result.value exists
        expect(result.value).toBe(42);
      }
    });

    it('should work with different value types', () => {
      const stringResult = Result.success('test');
      const objectResult = Result.success({ id: 1, name: 'John' });
      const arrayResult = Result.success([1, 2, 3]);

      expect(Result.isSuccess(stringResult)).toBe(true);
      expect(Result.isSuccess(objectResult)).toBe(true);
      expect(Result.isSuccess(arrayResult)).toBe(true);
    });

    it('should work with null and undefined values', () => {
      const nullResult = Result.success(null);
      const undefinedResult = Result.success(undefined);

      expect(Result.isSuccess(nullResult)).toBe(true);
      expect(Result.isSuccess(undefinedResult)).toBe(true);
    });
  });

  describe('isFailure', () => {
    it('should return true for failure result', () => {
      const result = Result.failure(['Error']);

      expect(Result.isFailure(result)).toBe(true);
    });

    it('should return false for successful result', () => {
      const result = Result.success(42);

      expect(Result.isFailure(result)).toBe(false);
    });

    it('should return false for loading result', () => {
      const result = Result.loading();

      expect(Result.isFailure(result)).toBe(false);
    });

    it('should narrow type to Failure when true', () => {
      const result: Result<number> = Result.failure(['Error message']);

      if (Result.isFailure(result)) {
        // TypeScript should know result.errors exists
        expect(result.errors).toEqual(['Error message']);
      }
    });

    it('should work with multiple errors', () => {
      const result = Result.failure(['Error 1', 'Error 2', 'Error 3']);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.errors).toHaveLength(3);
      }
    });

    it('should work with empty errors array', () => {
      const result = Result.failure([]);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.errors).toEqual([]);
      }
    });
  });

  describe('isLoading', () => {
    it('should return true for loading result', () => {
      const result = Result.loading();

      expect(Result.isLoading(result)).toBe(true);
    });

    it('should return false for successful result', () => {
      const result = Result.success(42);

      expect(Result.isLoading(result)).toBe(false);
    });

    it('should return false for failure result', () => {
      const result = Result.failure(['Error']);

      expect(Result.isLoading(result)).toBe(false);
    });

    it('should narrow type to Loading when true', () => {
      const result: Result<number> = Result.loading();

      if (Result.isLoading(result)) {
        // TypeScript should know this is Loading type
        expect(result.isLoading).toBe(true);
        expect(result.isFailure).toBe(false);
      }
    });
  });

  describe('helper functions combined usage', () => {
    it('should allow clean if-else chains', () => {
      const results = [Result.success(42), Result.failure(['Error']), Result.loading()];

      for (const result of results) {
        if (Result.isLoading(result)) {
          expect(result.isLoading).toBe(true);
        } else if (Result.isFailure(result)) {
          expect(result.errors).toBeDefined();
        } else if (Result.isSuccess(result)) {
          expect(result.value).toBeDefined();
        }
      }
    });

    it('should work with combined results', () => {
      const combined = Result.combine({
        name: Result.success('John'),
        age: Result.success(30),
      });

      expect(Result.isSuccess(combined)).toBe(true);
      if (Result.isSuccess(combined)) {
        expect(combined.value).toEqual({ name: 'John', age: 30 });
      }
    });

    it('should work with combineArray results', () => {
      const combined = Result.combineArray([Result.success(1), Result.success(2), Result.success(3)]);

      expect(Result.isSuccess(combined)).toBe(true);
      if (Result.isSuccess(combined)) {
        expect(combined.value).toEqual([1, 2, 3]);
      }
    });

    it('should enable early returns in functions', () => {
      const processResult = (result: Result<number>): string => {
        if (Result.isLoading(result)) {
          return 'Loading...';
        }

        if (Result.isFailure(result)) {
          return `Error: ${result.errors.join(', ')}`;
        }

        return `Value: ${result.value}`;
      };

      expect(processResult(Result.loading())).toBe('Loading...');
      expect(processResult(Result.failure(['Something went wrong']))).toBe('Error: Something went wrong');
      expect(processResult(Result.success(42))).toBe('Value: 42');
    });
  });

  describe('edge cases', () => {
    it('should handle results with boolean values', () => {
      const trueResult = Result.success(true);
      const falseResult = Result.success(false);

      expect((trueResult as Success<boolean>).value).toBe(true);
      expect((falseResult as Success<boolean>).value).toBe(false);
    });

    it('should handle results with zero', () => {
      const result = Result.success(0);

      expect(result.isFailure).toBe(false);
      expect((result as Success<number>).value).toBe(0);
    });

    it('should handle results with empty string', () => {
      const result = Result.success('');

      expect(result.isFailure).toBe(false);
      expect((result as Success<string>).value).toBe('');
    });

    it('should handle results with empty array', () => {
      const result = Result.success([]);

      expect(result.isFailure).toBe(false);
      expect((result as Success<any[]>).value).toEqual([]);
    });

    it('should handle combine with all failures', () => {
      const results = {
        field1: Result.failure(['Error 1']),
        field2: Result.failure(['Error 2']),
      };

      const combined = Result.combine(results);

      expect(combined.isFailure).toBe(true);
      expect((combined as Failure).errors).toEqual(['Error 1', 'Error 2']);
    });

    it('should handle combineArray with all failures', () => {
      const results = [Result.failure(['Error 1']), Result.failure(['Error 2'])];

      const combined = Result.combineArray(results);

      expect(combined.isFailure).toBe(true);
      expect((combined as Failure).errors).toEqual(['Error 1', 'Error 2']);
    });
  });
});
