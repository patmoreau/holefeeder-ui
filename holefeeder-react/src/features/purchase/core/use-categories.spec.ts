import { act, renderHook, waitFor } from '@testing-library/react-native';
import { aCategory } from '@/__tests__';
import { createMockPowerSyncContext, createTestPowerSyncDb } from '@/__tests__/utils/test-powersync-provider';
import { usePowerSync } from '@/contexts/PowersyncProvider';
import { useCategories } from '@/features/purchase/core/use-categories';

jest.mock('@/contexts/PowersyncProvider');

const mockUsePowerSync = jest.mocked(usePowerSync);

describe('useCategories', () => {
  let testDb: any;
  const mockCategories = [aCategory({ name: 'Category 1' }), aCategory({ name: 'Category 2' })];

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create a fresh mock database for each test
    testDb = createTestPowerSyncDb();

    // Mock usePowerSync to return our test database
    mockUsePowerSync.mockReturnValue(createMockPowerSyncContext(testDb));

    // Insert test data into the in-memory database
    for (const category of mockCategories) {
      await testDb.execute('INSERT INTO categories (id, type, name, color, budget_amount, favorite) VALUES (?, ?, ?, ?, ?, ?)', [
        category.id,
        category.type,
        category.name,
        category.color,
        category.budgetAmount,
        category.favorite ? 1 : 0,
      ]);
    }
  });

  afterEach(async () => {
    jest.clearAllMocks();
    // Clean up the database
    if (testDb) {
      await testDb.disconnectAndClear();
      await testDb.close();
    }
  });

  it('should fetch categories from PowerSync database', async () => {
    const { result } = renderHook(() => useCategories());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when fetching categories', async () => {
    // Suppress expected console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Close the database to cause an error
    await testDb.close();

    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).not.toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should provide a refetch function', async () => {
    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.refetch).toBeInstanceOf(Function);

    // Insert a new category
    const newCategory = aCategory({ name: 'New Category' });
    await testDb.execute('INSERT INTO categories (id, type, name, color, budget_amount, favorite) VALUES (?, ?, ?, ?, ?, ?)', [
      newCategory.id,
      newCategory.type,
      newCategory.name,
      newCategory.color,
      newCategory.budgetAmount,
      newCategory.favorite ? 1 : 0,
    ]);

    // Refetch
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data.length).toBe(3);
      expect(result.current.data).toContainEqual(newCategory);
    });
  });
});
