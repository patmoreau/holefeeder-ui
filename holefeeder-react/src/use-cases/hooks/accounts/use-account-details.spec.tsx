import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { anAccount } from '@/__tests__/builders/account-for-test';
import { aCategory } from '@/__tests__/builders/category-for-test';
import { aTransaction } from '@/__tests__/builders/transaction-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { DateOnly } from '@/shared/core/date-only';
import { Money } from '@/shared/core/money';
import { AccountTypes } from '@/use-cases/core/accounts/account-type';
import { CategoryTypes } from '@/use-cases/core/categories/category-type';
import { useAccountDetails } from '@/use-cases/hooks/accounts/use-account-details';

describe('useAccountDetails', () => {
  let db: DatabaseForTest;
  const account = anAccount({ openBalance: Money.valid(100), type: AccountTypes.creditCard });
  const category = aCategory({ type: CategoryTypes.expense });
  const transaction = aTransaction({ amount: Money.valid(123.45), date: DateOnly.valid('2025-01-01') }, account, category);

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useAccountDetails(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await transaction.store(db);
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

    expect(result.current).toBeSuccessWithValue([
      {
        id: account.id,
        name: account.name,
        balance: Money.valid(223.45),
        lastTransactionDate: DateOnly.valid('2025-01-01'),
        projectedBalance: Money.ZERO,
        upcomingVariation: Money.ZERO,
      },
    ]);
  });
});
