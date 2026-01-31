# Store Items Repository Testing Guide

## Overview

The store items repository has been refactored to separate concerns between hooks and testable business logic. This makes it much easier to test use cases without needing to mock React hooks.

## Architecture

### For React Components (using hooks)

```typescript
// In your component or custom hook
import { useStoreItemsRepository } from '@/use-cases/persistence/store-items-repository-in-powersync';
import { useCaseGetSettings } from '@/use-cases/core/store-items/get-settings/get-settings-use-case';

export const useSettings = () => {
  // Call the repository hook with the code
  const repositoryResult = useStoreItemsRepository('settings');
  
  // Pass the result to the use case
  const result = useCaseGetSettings(repositoryResult);
  
  // Use the result in your component
  return result;
};
```

### For Testing (without hooks)

```typescript
import { Result } from '@/shared/core/result';
import { createStoreItemsRepository } from '@/use-cases/persistence/store-items-repository-in-powersync';
import { useCaseGetSettings } from '@/use-cases/core/store-items/get-settings/get-settings-use-case';
import { aStoreItem } from '@/use-cases/__tests__/store-item-for-test';

describe('GetSettingsUseCase', () => {
  it('should return settings successfully', () => {
    // Arrange: Create mock data
    const storeItem = aStoreItem({
      code: 'settings',
      data: JSON.stringify({ theme: 'dark', language: 'en' }),
    });
    
    // Create a mock Result instead of a mock function
    const storeItemResult = Result.success(storeItem);
    
    // Act: Call the use case directly with the result
    const result = useCaseGetSettings(storeItemResult);
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual({ theme: 'dark', language: 'en' });
  });

  it('should handle loading state', () => {
    // Arrange: Create a loading result
    const storeItemResult = Result.loading();
    
    // Act
    const result = useCaseGetSettings(storeItemResult);
    
    // Assert
    expect(result.isLoading).toBe(true);
  });

  it('should handle errors', () => {
    // Arrange: Create a failure result
    const storeItemResult = Result.failure(['Database error']);
    
    // Act
    const result = useCaseGetSettings(storeItemResult);
    
    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('Database error');
  });
});
```

## Key Benefits

### 1. **No Hook Mocking Required**
- You don't need to mock `useQuery` from PowerSync
- You don't need to wrap tests in `renderHook`
- Tests run faster and are more reliable

### 2. **Pure Function Testing**
- Use cases are now pure functions that take `Result<StoreItem>` and return `Result<Settings>`
- Easy to test all edge cases (loading, success, failure)
- No React testing library required for use case tests

### 3. **Type Safety**
- The repository function signature ensures type safety
- TypeScript will catch if you pass the wrong type of Result

### 4. **Flexible Test Data**
- You can easily create different scenarios:
  ```typescript
  // Success case
  const success = Result.success(aStoreItem({ code: 'settings', data: '...' }));
  
  // Loading case
  const loading = Result.loading();
  
  // Error case
  const error = Result.failure(['Database connection failed']);
  
  // Not found case
  const notFound = Result.failure([StoreItemsRepositoryErrors.storeItemNotFound]);
  ```

## Migration Guide

### Before (Hard to Test)
```typescript
// Use case was tightly coupled to the repository function
export const useCaseGetSettings = (repository: StoreItemsRepository): Result<Settings> => {
  const result = repository('settings'); // Can't test without mocking
  // ... rest of logic
};

// Test required complex mocking
const mockRepository = jest.fn();
mockRepository.mockReturnValue(Result.success(storeItem));
const result = useCaseGetSettings(mockRepository);
```

### After (Easy to Test)
```typescript
// Use case accepts the data it needs
export const useCaseGetSettings = (storeItemResult: Result<StoreItem>): Result<Settings> => {
  if (storeItemResult.isLoading || storeItemResult.isFailure) {
    return storeItemResult as Result<Settings>;
  }
  // ... rest of logic
};

// Test is simple and direct
const storeItemResult = Result.success(storeItem);
const result = useCaseGetSettings(storeItemResult);
```

## When to Use Each Approach

### Use `useStoreItemsRepository` (hook) when:
- Inside React components
- Inside custom hooks
- You need reactive/live updates from PowerSync

### Use `createStoreItemsRepository` (factory) when:
- Writing integration tests that need to control data
- Testing multiple repository scenarios in one test
- You want to avoid PowerSync database setup

### Use direct `Result<StoreItem>` when:
- Writing unit tests for use cases
- Testing business logic in isolation
- You want the fastest possible tests

## Example: Testing Multiple Scenarios

```typescript
describe('Settings Use Case', () => {
  it('should handle various data states', () => {
    const scenarios = [
      {
        name: 'valid settings',
        input: Result.success(aStoreItem({ data: JSON.stringify({ theme: 'dark' }) })),
        expected: { theme: 'dark' },
      },
      {
        name: 'loading state',
        input: Result.loading(),
        expectedLoading: true,
      },
      {
        name: 'database error',
        input: Result.failure(['DB Error']),
        expectedError: 'DB Error',
      },
    ];

    scenarios.forEach(({ name, input, expected, expectedLoading, expectedError }) => {
      const result = useCaseGetSettings(input);

      if (expectedLoading) {
        expect(result.isLoading).toBe(true);
      } else if (expectedError) {
        expect(result.errors).toContain(expectedError);
      } else {
        expect(result.value).toEqual(expected);
      }
    });
  });
});
```

## Summary

The refactored architecture provides:
- ✅ Separation of concerns (hooks vs business logic)
- ✅ Easy testing without mocks
- ✅ Type-safe repository pattern
- ✅ Fast, reliable tests
- ✅ Clear data flow from repository → use case → component
