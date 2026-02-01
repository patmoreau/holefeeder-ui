import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { anAccount, toAccount } from '@/__tests__/builders/account-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { useAccounts } from '@/use-cases/hooks/accounts/use-accounts';

describe('useAccounts', () => {
  let db: DatabaseForTest;
  const account = anAccount();

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useAccounts(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await account.store(db);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch accounts from PowerSync database', async () => {
    const { result } = await createHook();
    // Initially loading
    expect(result.current).toBeLoading();

    // Wait for data to load
    await waitFor(() => expect(result.current).not.toBeLoading());

    expect(result.current).toBeSuccessWithValue([toAccount(account)]);
  });
});
