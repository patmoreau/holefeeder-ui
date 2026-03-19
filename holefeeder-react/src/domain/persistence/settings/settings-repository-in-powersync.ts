import { AbstractPowerSyncDatabase } from '@powersync/common';
import { AsyncResult, Result } from '@/domain/core/result';
import { DataMetrics, DEFAULT_DATA_METRICS } from '@/domain/core/settings/data-metrics';
import { SettingsRepository } from '@/domain/core/settings/settings-repository';
import { watchSingle } from '@/domain/persistence/watch-query';

type DataMetricsRow = {
  accounts: number;
  cashflows: number;
  categories: number;
  storeItems: number;
  transactions: number;
  outstandingTransactions: number;
};

export const SettingsRepositoryInPowersync = (db: AbstractPowerSyncDatabase): SettingsRepository => {
  const watchDataMetrics = (onDataChange: (result: AsyncResult<DataMetrics>) => void) =>
    watchSingle<DataMetricsRow, DataMetrics>(
      db,
      `
        SELECT
            (SELECT count(*) FROM accounts) as accounts,
            (SELECT count(*) FROM cashflows) as cashflows,
            (SELECT count(*) FROM categories) as categories,
            (SELECT count(*) FROM store_items) as storeItems,
            (SELECT count(*) FROM transactions) as transactions,
            (SELECT count(*) FROM ps_crud) as outstandingTransactions
            `,
      [],
      (row) => ({
        accounts: row.accounts,
        cashflows: row.cashflows,
        categories: row.categories,
        storeItems: row.storeItems,
        transactions: row.transactions,
        outstandingTransactions: row.outstandingTransactions,
      }),
      onDataChange,
      () => Result.success(DEFAULT_DATA_METRICS)
    );

  return {
    watchDataMetrics: watchDataMetrics,
  };
};
