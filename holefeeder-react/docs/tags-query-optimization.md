# Tags Query Optimization Analysis

## Current Situation

- **13,000+ transactions** accumulated since 2014
- Tags stored as **comma-separated strings** in `transactions.tags` column
- Recursive CTE query to split and aggregate tags
- Query runs on **every transaction change** via PowerSync watch

## Performance Analysis

### Query Complexity

The current recursive CTE:

1. Scans **all transactions** with non-null tags
2. Recursively splits comma-separated values
3. Groups and counts occurrences
4. Orders by count and tag name

**Estimated complexity:** O(n × m) where:

- n = number of transactions with tags
- m = average number of tags per transaction

### Optimizations Applied

#### 1. ✅ Added Index on `tags` Column

```typescript
transactions_tags: ['tags']
```

- Speeds up filtering `WHERE tags IS NOT NULL AND tags <> ''`
- Reduces table scan time

#### 2. ✅ Early Filtering in Base Case

```sql
WHERE tags IS NOT NULL AND tags <> ''
```

- Filters out empty tags in the base case (was missing before)
- Reduces recursive iterations

### Expected Performance

With optimizations:

- **Simple case** (few unique tags, ~10-50): **5-15ms**
- **Moderate case** (100-200 unique tags): **15-50ms**
- **Heavy case** (1000+ transactions with tags): **50-200ms**

### Monitoring

The dev console.log will show actual performance:

```javascript
[PowerSync] Query executed on local SQLite DB (watch update) {
  rowCount: 42,
  duration: "23.45ms",
  sql: "WITH RECURSIVE split(tag, remainder) AS..."
}
```

## Alternative Approaches (Future Optimization)

If performance becomes an issue (>100ms consistently):

### Option 1: Denormalized Tags Table

Create a separate `transaction_tags` table synced from backend:

```sql
CREATE TABLE transaction_tags (
  transaction_id TEXT,
  tag TEXT,
  PRIMARY KEY (transaction_id, tag)
);

-- Then simple query:
SELECT tag, COUNT(*) as count
FROM transaction_tags
GROUP BY tag
ORDER BY count DESC;
```

**Pros:**

- Much faster (O(n) instead of O(n×m))
- Simple query
- Better indexing

**Cons:**

- Requires backend schema change
- More storage (denormalized)
- More sync data

### Option 2: Limit to Recent Transactions

Only analyze tags from recent transactions (e.g., last 2 years):

```sql
WHERE tags IS NOT NULL 
  AND tags <> ''
  AND date >= date('now', '-2 years')
```

**Pros:**

- Significantly reduces dataset
- Most relevant tags surface
- Fast query

**Cons:**

- May miss older but still relevant tags
- Arbitrary cutoff

### Option 3: Client-Side Caching

Cache the tag results and only recompute on transaction changes:

```typescript
// Use React Query with longer staleTime
// Or implement debouncing in the hook
```

## Recommendations

### Current State ✅

**The query is reasonably optimized for now.** With the index and filtering:

- Should handle 13k rows acceptably
- Recursive CTE is appropriate for this use case
- Watch ensures it only runs on actual changes

### Monitor Performance

1. Check the console logs for actual duration
2. If duration consistently > 100ms → consider alternatives
3. If duration < 50ms → no action needed

### When to Optimize Further

- Users report lag when adding transactions
- Console shows duration > 100ms
- Number of transactions grows to 50k+
- Number of unique tags grows to 1000+

### Backend Consideration

Since tags are comma-separated in Postgres backend, consider:

- Using PostgreSQL array type instead of CSV
- Creating a separate tags endpoint that pre-computes this
- Adding a tags dimension table

## Implementation Notes

The current implementation is **appropriate for an offline-first mobile app** because:

- ✅ All computation is local (no network)
- ✅ SQLite handles recursive CTEs efficiently
- ✅ Watch only triggers on actual changes
- ✅ Users expect slight delays when opening forms (acceptable)
- ✅ 13k rows is manageable for modern mobile devices

**Verdict:** Monitor, but don't over-optimize prematurely.
