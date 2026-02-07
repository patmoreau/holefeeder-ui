import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { aCategory, toCategory } from '@/__tests__/builders/category-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { useCategories } from '@/use-cases/hooks/categories/use-categories';

describe('useCategories', () => {
  let db: DatabaseForTest;
  const category = aCategory();

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useCategories(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await category.store(db);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch categories from PowerSync database', async () => {
    const { result } = await createHook();
    // Initially loading
    expect(result.current).toBeLoading();

    // Wait for data to load
    await waitFor(() => expect(result.current).not.toBeLoading());

    expect(result.current).toBeSuccessWithValue([toCategory(category)]);
  });
});
