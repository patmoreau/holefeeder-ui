import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AuthContextForTest } from '@/__tests__/AuthContextForTest';
import { aTransaction } from '@/__tests__/builders/transaction-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { useTags } from '@/features/purchase/core/use-tags';

describe('useTags', () => {
  let db: DatabaseForTest;
  const firstTransaction = aTransaction({ tags: ['groceries', 'food'] });
  const secondTransaction = aTransaction({ tags: ['groceries', 'shopping'] });
  const thirdTransaction = aTransaction({ tags: ['food'] });

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await firstTransaction.store(db);
    await secondTransaction.store(db);
    await thirdTransaction.store(db);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch tags from PowerSync database', async () => {
    const { result } = await waitFor(() =>
      renderHook(() => useTags(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <AuthContextForTest>
            <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
          </AuthContextForTest>
        ),
      })
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const tags = result.current.data || [];
    expect(tags.length).toBeGreaterThan(0);

    tags.forEach((tag) => {
      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('tag');
      expect(tag).toHaveProperty('count');
      expect(tag.id).toBe(tag.tag); // id should equal tag
    });
  });

  it('should extract tags from comma-separated values', async () => {
    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContextForTest>
          <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
        </AuthContextForTest>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should have tags: groceries (2), food (2), shopping (1)
    const tags = result.current.data || [];
    expect(tags.length).toBeGreaterThan(0);

    // Each tag should have id, tag, and count fields
    tags.forEach((tag) => {
      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('tag');
      expect(tag).toHaveProperty('count');
      expect(tag.id).toBe(tag.tag); // id should equal tag
    });
  });

  it('should count tag occurrences correctly', async () => {
    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContextForTest>
          <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
        </AuthContextForTest>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const tags = result.current.data || [];

    // Find specific tags and verify their counts
    const groceriesTag = tags.find((t) => t.tag === 'groceries');
    const foodTag = tags.find((t) => t.tag === 'food');
    const shoppingTag = tags.find((t) => t.tag === 'shopping');

    expect(groceriesTag).toBeDefined();
    expect(groceriesTag?.count).toBe(2);

    expect(foodTag).toBeDefined();
    expect(foodTag?.count).toBe(2);

    expect(shoppingTag).toBeDefined();
    expect(shoppingTag?.count).toBe(1);
  });

  it('should order tags by count DESC', async () => {
    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContextForTest>
          <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
        </AuthContextForTest>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const tags = result.current.data || [];

    // Tags with higher counts should come first
    // groceries (2) and food (2) should come before shopping (1)
    for (let i = 0; i < tags.length - 1; i++) {
      expect(tags[i].count).toBeGreaterThanOrEqual(tags[i + 1].count);
    }
  });

  it('should handle errors when fetching tags', async () => {
    // Suppress expected console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Close the database to cause an error
    await db.close();

    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContextForTest>
          <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
        </AuthContextForTest>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).not.toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should provide a refetch function', async () => {
    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContextForTest>
          <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
        </AuthContextForTest>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.refetch).toBeInstanceOf(Function);

    const initialTagsCount = result.current.data?.length || 0;

    // Insert a new transaction with a new tag
    await db.execute('INSERT INTO transactions (id, date, amount, description, tags, account_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      'trans-4',
      '2024-01-04',
      400,
      'Transaction 4',
      'new-tag',
      'acc-1',
      'cat-1',
    ]);

    // Refetch
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      const newTags = result.current.data || [];
      // Should have a new tag
      expect(newTags.length).toBeGreaterThanOrEqual(initialTagsCount);
      expect(newTags.some((t) => t.tag === 'new-tag')).toBe(true);
    });
  });

  it('should handle empty tags correctly', async () => {
    // Clear existing data and add a transaction without tags
    await db.disconnectAndClear();

    await db.execute('INSERT INTO transactions (id, date, amount, description, tags, account_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      'trans-empty',
      '2024-01-01',
      100,
      'No tags',
      '',
      'acc-1',
      'cat-1',
    ]);

    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContextForTest>
          <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
        </AuthContextForTest>
      ),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should return empty array or only valid tags
    const tags = result.current.data || [];
    tags.forEach((tag) => {
      expect(tag.tag).not.toBe('');
    });
  });
});
