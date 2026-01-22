import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AuthContextForTest } from '@/__tests__/AuthContextForTest';
import { aCategory, toCategory } from '@/__tests__/builders/category-for-test';
import { setupDatabaseForTest, DatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { useCategories } from '@/features/purchase/core/use-categories';

describe('useCategories', () => {
  let db: DatabaseForTest;
  const firstCategory = aCategory({ name: 'Category 1', favorite: false });
  const secondCategory = aCategory({ name: 'Category 2', favorite: false });
  const thirdCategory = aCategory({ name: 'Category 3', favorite: true });

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await firstCategory.store(db);
    await secondCategory.store(db);
    await thirdCategory.store(db);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch categories from PowerSync database', async () => {
    const { result } = await waitFor(() =>
      renderHook(() => useCategories(), {
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

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([thirdCategory, firstCategory, secondCategory].map(toCategory));
  });
});
