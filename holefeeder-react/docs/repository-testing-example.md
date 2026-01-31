# Quick Example: Testing with Repository Pattern

## The Problem We Solved

Previously, you couldn't easily test use cases because they depended on React hooks, which can't be called outside of React components.

## The Solution

Now you can test use cases by passing `Result<StoreItem>` directly:

```typescript
// ✅ EASY TO TEST - Just pass a Result object
import { Result } from '@/shared/core/result';
import { useCaseGetSettings } from '@/use-cases/core/store-items/get-settings/get-settings-use-case';
import { aStoreItem } from '@/use-cases/__tests__/store-item-for-test';

describe('GetSettingsUseCase', () => {
  it('should return settings', () => {
    // Create test data
    const storeItem = aStoreItem({
      code: 'settings',
      data: JSON.stringify({ theme: 'dark' }),
    });
    
    // Create a Result - NO HOOKS NEEDED!
    const storeItemResult = Result.success(storeItem);
    
    // Test the use case
    const result = useCaseGetSettings(storeItemResult);
    
    // Verify
    expect(result.isSuccess).toBe(true);
    expect(result.value.theme).toBe('dark');
  });
});
```

## Alternative: Using createStoreItemsRepository for Complex Tests

If you need to test multiple repository calls or want a reusable mock:

```typescript
import { createStoreItemsRepository } from '@/use-cases/persistence/store-items-repository-in-powersync';

describe('Complex Scenario', () => {
  it('should handle multiple store items', () => {
    // Create a mock repository with test data
    const repository = createStoreItemsRepository({
      settings: Result.success(aStoreItem({ 
        code: 'settings', 
        data: JSON.stringify({ theme: 'dark' }) 
      })),
      preferences: Result.success(aStoreItem({ 
        code: 'preferences', 
        data: JSON.stringify({ notifications: true }) 
      })),
    });
    
    // Use the repository function
    const settingsResult = repository('settings');
    const preferencesResult = repository('preferences');
    
    // Verify
    expect(settingsResult.isSuccess).toBe(true);
    expect(preferencesResult.isSuccess).toBe(true);
  });
});
```

## Summary

**Before:** Had to mock hooks → Complex, brittle tests

**After:** Pass data directly → Simple, fast tests

See [store-items-repository-testing-guide.md](./store-items-repository-testing-guide.md) for the complete guide.
