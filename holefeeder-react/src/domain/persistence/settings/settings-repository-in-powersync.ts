import { AbstractPowerSyncDatabase } from '@powersync/common';
import { AsyncResult, Result } from '@/domain/core/result';
import { DataMetrics } from '@/domain/core/settings/data-metrics';
import { SettingsRepository } from '@/domain/core/settings/settings-repository';

export const SettingsRepositoryInPowersync = (db: AbstractPowerSyncDatabase): SettingsRepository => {
  const watchDataMetrics = (onDataChange: (result: AsyncResult<DataMetrics>) => void) => {
    onDataChange(Result.loading());

    const query = db.query<{
      accounts: number;
      cashflows: number;
      categories: number;
      storeItems: number;
      transactions: number;
      outstandingTransactions: number;
    }>({
      sql: `
        SELECT
            (SELECT count(*) FROM accounts) as accounts,
            (SELECT count(*) FROM cashflows) as cashflows,
            (SELECT count(*) FROM categories) as categories,
            (SELECT count(*) FROM store_items) as storeItems,
            (SELECT count(*) FROM transactions) as transactions,
            (SELECT count(*) FROM ps_crud) as outstandingTransactions
      `,
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(
              Result.success({ accounts: 0, cashflows: 0, categories: 0, storeItems: 0, transactions: 0, outstandingTransactions: 0 })
            )
          : onDataChange(Result.success({ ...data[0] })),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  return {
    watchDataMetrics: watchDataMetrics,
  };
};
