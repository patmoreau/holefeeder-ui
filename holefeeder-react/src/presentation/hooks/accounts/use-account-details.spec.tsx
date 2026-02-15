import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { AccountTypes } from '@/domain/core/accounts/account-type';
import { aCategory } from '@/domain/core/categories/__tests__/category-for-test';
import { CategoryTypes } from '@/domain/core/categories/category-type';
import { DateIntervalTypes } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { aCashflow } from '@/domain/core/flows/__tests__/cashflow-for-test';
import { aTransaction } from '@/domain/core/flows/__tests__/transaction-for-test';
import { Money } from '@/domain/core/money';
import { aSettings } from '@/domain/core/store-items/__tests__/settings-for-test';
import { aStoreItem } from '@/domain/core/store-items/__tests__/store-item-for-test';
import { SETTINGS_CODE } from '@/domain/core/store-items/settings';
import { Variation } from '@/domain/core/variation';
import { useAccountDetails } from '@/presentation/hooks/accounts/use-account-details';

describe('useAccountDetails', () => {
  let db: DatabaseForTest;
  const account = anAccount({ openBalance: Variation.valid(100), type: AccountTypes.creditCard });
  const category = aCategory({ type: CategoryTypes.expense });
  const cashflow = aCashflow({
    accountId: account.id,
    categoryId: category.id,
    amount: Money.valid(123.45),
    effectiveDate: DateOnly.valid('2025-01-01'),
    intervalType: DateIntervalTypes.monthly,
    frequency: 1,
  });
  const transaction = aTransaction({
    accountId: account.id,
    categoryId: category.id,
    amount: Money.valid(123.45),
    date: DateOnly.valid('2025-01-01'),
    cashflowId: cashflow.id,
    cashflowDate: cashflow.effectiveDate,
  });
  const settings = aSettings({
    effectiveDate: DateOnly.valid('2025-01-01'),
    intervalType: DateIntervalTypes.monthly,
    frequency: 1,
  });

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useAccountDetails(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await aStoreItem({ code: SETTINGS_CODE, data: JSON.stringify(settings) }).store(db);
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

    expect(result.current).toBeSuccessWithValue(expect.anything());
  });
});
