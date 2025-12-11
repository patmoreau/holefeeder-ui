# Singleton Query Hook Pattern

## Overview

The `createSingletonQueryHook` is designed for queries that:

- Don't require an `id` parameter (singleton resources)
- Should be cached indefinitely until explicitly invalidated
- Should only refetch when related mutations occur

## Use Case: Dashboard Summary

The dashboard summary is a perfect example of a singleton query:

- It's a single resource without an `id`
- It should be cached and not refetched on every render
- It should only update when transactions are created, updated, or deleted

## Implementation

### 1. Create the Query Hook

```typescript
import { Summary } from '@/features/dashboard/core/summary';
import { dashboardApi } from '@/features/dashboard/api/dashboard-api';
import { createSingletonQueryHook } from '@/shared/hooks/queries/use-query';

const dashboardSummaryQuery = createSingletonQueryHook<Summary>('dashboard', (token) =>
  dashboardApi(token)
    .query()
    .then((res) => res.data)
);

export const { useSingleton: useDashboardSummary, keys: dashboardSummaryKeys } =
  dashboardSummaryQuery;
```

### 2. Configure Mutations to Invalidate the Cache

In your mutation hooks, add the resource name to the `affectedResources` array:

```typescript
const purchaseMutation = createMutationHook<PurchaseFormData>(
  'transactions',
  (data, token) => {
    return transactionApi(token).createTransaction(data).then();
  },
  ['dashboard'] // ← This invalidates the dashboard summary
);
```

### 3. Use the Hook in Components

```typescript
import { useDashboardSummary } from '@/features/dashboard/core/use-dashboard-summary';

export const DashboardComponent = () => {
  const { data: summary, isLoading, isError } = useDashboardSummary();

  // Summary will only be fetched once and cached
  // It will automatically refetch when transactions are modified
};
```

## How It Works

1. **Initial Fetch**: The first time `useDashboardSummary()` is called, it fetches the data
2. **Caching**: The data is cached with `staleTime: Infinity`, so it never becomes stale automatically
3. **Cache Invalidation**: When a transaction mutation completes successfully, it calls:
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['dashboard', 'singleton'] })
   ```
4. **Automatic Refetch**: React Query detects the invalidation and refetches the data automatically

## Benefits

✅ **Performance**: Data is only fetched when needed, not on every render
✅ **Fresh Data**: Always up-to-date after mutations
✅ **Simple API**: No need to manually pass ids or parameters
✅ **Type-Safe**: Full TypeScript support

## Configuration Options

The `createSingletonQueryHook` accepts:

- `resourceName`: The query key prefix (e.g., 'dashboard')
- `getSingleton`: Async function that fetches the data
- `withAuth`: Whether authentication is required (default: true)

The hook returns:

- `useSingleton`: The React hook to use in components
- `keys`: Query key factory for manual cache manipulation

