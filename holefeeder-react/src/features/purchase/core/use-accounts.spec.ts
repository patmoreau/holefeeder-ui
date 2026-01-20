import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createMockPowerSyncContext, createTestPowerSyncDb } from '@/__tests__/utils';
import { usePowerSync } from '@/contexts/PowersyncProvider';
import { useAccounts } from '@/features/purchase/core/use-accounts';

jest.mock('@/contexts/PowersyncProvider');

const mockUsePowerSync = jest.mocked(usePowerSync);

describe('useAccounts', () => {
  let testDb: any;

  // Create accounts with only the fields that useAccounts returns (id and name)
  const mockAccounts = [
    { id: 'account-1', name: 'Account 1' },
    { id: 'account-2', name: 'Account 2' },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create a fresh mock database for each test
    testDb = createTestPowerSyncDb();

    // Mock usePowerSync to return our test database
    mockUsePowerSync.mockReturnValue(createMockPowerSyncContext(testDb));

    // Insert test data into the in-memory database
    for (const account of mockAccounts) {
      await testDb.execute('INSERT INTO accounts (id, name, inactive, favorite) VALUES (?, ?, ?, ?)', [
        account.id,
        account.name,
        0, // inactive = 0 (active accounts only)
        0, // favorite = 0 (not a favorite)
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

  it('should fetch accounts from PowerSync database', async () => {
    const { result } = renderHook(() => useAccounts());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockAccounts);
    expect(result.current.error).toBeNull();
  });

  it('should only return active accounts (inactive = 0)', async () => {
    // Insert an inactive account
    const inactiveAccount = { id: 'inactive-account', name: 'Inactive Account' };
    await testDb.execute('INSERT INTO accounts (id, name, inactive, favorite) VALUES (?, ?, ?, ?)', [
      inactiveAccount.id,
      inactiveAccount.name,
      1, // inactive = 1
      0,
    ]);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should only contain the active accounts, not the inactive one
    expect(result.current.data).toEqual(mockAccounts);
    expect(result.current.data).not.toContainEqual(inactiveAccount);
  });

  it('should handle errors when fetching accounts', async () => {
    // Suppress expected console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Close the database to cause an error
    await testDb.close();

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).not.toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should provide a refetch function', async () => {
    const { result } = renderHook(() => useAccounts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.refetch).toBeInstanceOf(Function);

    // Insert a new account
    const newAccount = { id: 'new-account', name: 'New Account' };
    await testDb.execute('INSERT INTO accounts (id, name, inactive, favorite) VALUES (?, ?, ?, ?)', [newAccount.id, newAccount.name, 0, 0]);

    // Refetch
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data.length).toBe(3);
      expect(result.current.data).toContainEqual(newAccount);
    });
  });

  it('should order accounts by favorite DESC, then name ASC', async () => {
    // Clear existing accounts and insert accounts with specific favorite values
    await testDb.disconnectAndClear();

    const favoriteAccount = { id: 'zebra-account', name: 'Zebra Account' };
    const regularAccount1 = { id: 'apple-account', name: 'Apple Account' };
    const regularAccount2 = { id: 'banana-account', name: 'Banana Account' };

    // Insert in random order
    await testDb.execute('INSERT INTO accounts (id, name, inactive, favorite) VALUES (?, ?, ?, ?)', [
      regularAccount2.id,
      regularAccount2.name,
      0,
      0,
    ]);
    await testDb.execute('INSERT INTO accounts (id, name, inactive, favorite) VALUES (?, ?, ?, ?)', [
      favoriteAccount.id,
      favoriteAccount.name,
      0,
      1, // favorite
    ]);
    await testDb.execute('INSERT INTO accounts (id, name, inactive, favorite) VALUES (?, ?, ?, ?)', [
      regularAccount1.id,
      regularAccount1.name,
      0,
      0,
    ]);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should be ordered: favorite first, then alphabetically
    expect(result.current.data[0]).toEqual(favoriteAccount);
    expect(result.current.data[1]).toEqual(regularAccount1);
    expect(result.current.data[2]).toEqual(regularAccount2);
  });
});
