import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { anAccount, toAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { useAccounts } from '@/presentation/hooks/accounts/use-accounts';

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

    expect(result.current).toBeLoading();

    await waitFor(() => expect(result.current).not.toBeLoading());

    expect(result.current).toBeSuccessWithValue([toAccount(account)]);
  });
});
