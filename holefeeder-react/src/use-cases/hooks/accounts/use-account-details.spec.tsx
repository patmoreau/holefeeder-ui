import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { anAccount } from '@/__tests__/builders/account-for-test';
import { aCategory } from '@/__tests__/builders/category-for-test';
import { aTransaction } from '@/__tests__/builders/transaction-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { DateOnly } from '@/shared/core/date-only';
import { Money } from '@/shared/core/money';
import { Variation } from '@/shared/core/variation';
import { AccountTypes } from '@/use-cases/core/accounts/account-type';
import { CategoryTypes } from '@/use-cases/core/categories/category-type';
import { aCashflow } from '@/use-cases/core/flows/__tests__/cashflow-for-test';
import { useAccountDetails } from '@/use-cases/hooks/accounts/use-account-details';

describe('useAccountDetails', () => {
  let db: DatabaseForTest;
  const account = anAccount({ openBalance: Variation.valid(100), type: AccountTypes.creditCard });
  const category = aCategory({ type: CategoryTypes.expense });
  const cashflow = aCashflow({
    accountId: account.id,
    categoryId: category.id,
    amount: Money.valid(123.45),
    effectiveDate: DateOnly.valid('2025-01-01'),
  });
  const transaction = aTransaction({
    accountId: account.id,
    categoryId: category.id,
    amount: Money.valid(123.45),
    date: DateOnly.valid('2025-01-01'),
    cashflowId: cashflow.id,
    cashflowDate: cashflow.effectiveDate,
  });

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useAccountDetails(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await account.store(db);
    await category.store(db);
    await cashflow.store(db);
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
        balance: Variation.valid(223.45),
        lastTransactionDate: DateOnly.valid('2025-01-01'),
        projectedBalance: Variation.valid(223.45),
        upcomingVariation: Variation.valid(0),
      },
    ]);
  });
});
