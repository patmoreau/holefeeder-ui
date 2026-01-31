# Store Items Repository - Reactive Query Guide

## Overview

The store items repository hooks are **automatically reactive** to parameter changes. When you change the input parameters, the PowerSync query will automatically re-execute and return updated results.

## How Reactivity Works

PowerSync's `useQuery` hook (similar to React Query) automatically tracks its dependencies:

1. **Parameter changes**: When the SQL query parameters array changes, the query re-runs
2. **Database changes**: When the underlying data changes, the query automatically updates
3. **Memoization**: Results are memoized to prevent unnecessary re-renders

## Available Hooks

### 1. `useStoreItemsRepository(code: string)`

The primary hook for querying a single store item by code. This hook is **automatically reactive** to the `code` parameter.

```tsx
import { useStoreItemsRepository } from '@/use-cases/persistence/store-items-repository-in-powersync';

function SettingsPanel() {
  const [selectedCode, setSelectedCode] = useState('settings');
  
  // When selectedCode changes, the query AUTOMATICALLY re-runs
  const storeItemResult = useStoreItemsRepository(selectedCode);
  
  if (storeItemResult.isLoading) {
    return <LoadingSpinner />;
  }
  
  if (storeItemResult.isFailure) {
    return <ErrorMessage errors={storeItemResult.errors} />;
  }
  
  return (
    <View>
      <Text>{storeItemResult.value.data}</Text>
      <Button onPress={() => setSelectedCode('preferences')}>
        Switch to Preferences
      </Button>
    </View>
  );
}
```

**Key Points:**
- ✅ The query re-runs when `code` changes
- ✅ The query updates when database data changes
- ✅ Results are memoized to prevent unnecessary re-renders
- ✅ No manual refetch needed

### 2. `useStoreItemsRepositoryWithEnabled(code: string, enabled: boolean)`

Use this variant when you want to **conditionally execute** the query based on some condition.

```tsx
import { useStoreItemsRepositoryWithEnabled } from '@/use-cases/persistence/store-items-repository-in-powersync';

function ConditionalSettings({ userId }: { userId: string | null }) {
  const [itemCode, setItemCode] = useState('settings');
  
  // Only query when userId is available
  const shouldQuery = userId !== null;
  const result = useStoreItemsRepositoryWithEnabled(itemCode, shouldQuery);
  
  // When userId becomes available, the query automatically runs
  // When itemCode changes (and userId is available), the query automatically re-runs
  
  if (!shouldQuery) {
    return <Text>Please log in</Text>;
  }
  
  if (result.isLoading) {
    return <LoadingSpinner />;
  }
  
  return <SettingsDisplay data={result.value} />;
}
```

**Key Points:**
- ✅ Query only runs when `enabled` is `true`
- ✅ When enabled changes from `false` to `true`, query runs automatically
- ✅ When `code` changes (and enabled is `true`), query re-runs automatically
- ✅ Returns `Result.loading()` when disabled

### 3. `useAllStoreItems()`

Query all store items without filtering by code.

```tsx
import { useAllStoreItems } from '@/use-cases/persistence/store-items-repository-in-powersync';

function StoreItemsList() {
  const result = useAllStoreItems();
  
  // This query automatically updates when:
  // - Any store item is added to the database
  // - Any store item is modified
  // - Any store item is deleted
  
  if (result.isLoading) {
    return <LoadingSpinner />;
  }
  
  if (result.isFailure) {
    return <ErrorMessage errors={result.errors} />;
  }
  
  return (
    <FlatList
      data={result.value}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StoreItemRow code={item.code} data={item.data} />
      )}
    />
  );
}
```

## Reactive Patterns

### Pattern 1: Responding to User Input

```tsx
function SearchableStoreItems() {
  const [searchCode, setSearchCode] = useState('');
  const [debouncedCode, setDebouncedCode] = useState('');
  
  // Debounce to avoid querying on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(searchCode);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchCode]);
  
  // Query automatically re-runs when debouncedCode changes
  const result = useStoreItemsRepositoryWithEnabled(
    debouncedCode,
    debouncedCode.length > 0
  );
  
  return (
    <View>
      <TextInput
        value={searchCode}
        onChangeText={setSearchCode}
        placeholder="Search by code..."
      />
      {result.isLoading && <LoadingSpinner />}
      {!result.isFailure && !result.isLoading && (
        <StoreItemDetails item={result.value} />
      )}
    </View>
  );
}
```

### Pattern 2: Responding to Route Parameters

```tsx
import { useLocalSearchParams } from 'expo-router';

function StoreItemDetailsScreen() {
  // Get code from URL parameters
  const { code } = useLocalSearchParams<{ code: string }>();
  
  // Query automatically re-runs when route changes
  const result = useStoreItemsRepository(code);
  
  // Navigation between routes automatically triggers re-query
  return <StoreItemDisplay result={result} />;
}
```

### Pattern 3: Responding to State Changes

```tsx
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  // Different store items for different steps
  const codeMap = {
    1: 'step1-config',
    2: 'step2-config',
    3: 'step3-config',
  };
  
  // Query automatically re-runs when step changes
  const configResult = useStoreItemsRepository(codeMap[step]);
  
  return (
    <View>
      {!configResult.isLoading && (
        <FormStep
          config={JSON.parse(configResult.value.data)}
          onNext={() => setStep(step + 1)}
        />
      )}
    </View>
  );
}
```

## Performance Optimization

### Memoization is Built-in

The hooks already use `useMemo` internally, so you don't need to wrap the result:

```tsx
// ❌ Don't do this - unnecessary memoization
function MyComponent({ code }: { code: string }) {
  const result = useStoreItemsRepository(code);
  const memoizedResult = useMemo(() => result, [result]); // Unnecessary!
  return <Display result={memoizedResult} />;
}

// ✅ Do this instead
function MyComponent({ code }: { code: string }) {
  const result = useStoreItemsRepository(code);
  return <Display result={result} />;
}
```

### When to Use `enabled` Flag

Use the `enabled` flag to prevent unnecessary queries:

```tsx
// ❌ Avoid: Querying with invalid/empty data
function BadExample({ code }: { code: string | undefined }) {
  const result = useStoreItemsRepository(code ?? ''); // Queries even when code is undefined
  // ...
}

// ✅ Better: Only query when you have valid data
function GoodExample({ code }: { code: string | undefined }) {
  const result = useStoreItemsRepositoryWithEnabled(
    code ?? '',
    code !== undefined && code.length > 0
  );
  // ...
}
```

## Real-time Updates

PowerSync provides **real-time synchronization**. When data changes on the server and syncs to the local database, all active queries automatically update:

```tsx
function LiveStoreItems() {
  const result = useAllStoreItems();
  
  // This component will automatically re-render when:
  // 1. Initial data loads
  // 2. Server pushes new store items
  // 3. Another component modifies store items
  // 4. Store items are deleted
  
  return <StoreItemsList items={result.value} />;
}
```

## Testing with Reactive Queries

When testing, use the provided test utilities:

```tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';

it('should re-query when code changes', async () => {
  const { result, rerender } = renderHook(
    ({ code }) => useStoreItemsRepository(code),
    {
      wrapper: ({ children }) => (
        <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
      ),
      initialProps: { code: 'settings' },
    }
  );
  
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  const firstResult = result.current;
  
  // Change the code parameter
  rerender({ code: 'preferences' });
  
  // Query automatically re-runs with new code
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current).not.toBe(firstResult); // New result object
});
```

## Summary

✅ **The repository is automatically reactive** - no manual refetch needed  
✅ **Parameter changes trigger re-queries** - when code/enabled changes  
✅ **Database changes trigger updates** - real-time sync from PowerSync  
✅ **Results are memoized** - prevents unnecessary re-renders  
✅ **Use `enabled` flag** for conditional queries  
✅ **Multiple hooks available** for different use cases  

You don't need to do anything special to make it responsive - it already is! 🎉
