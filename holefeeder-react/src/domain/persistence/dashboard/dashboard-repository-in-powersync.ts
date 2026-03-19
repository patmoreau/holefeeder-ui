import { AbstractPowerSyncDatabase } from '@powersync/common';
import { DashboardRepository } from '@/domain/core/dashboard/dashboard-repository';
import { SummaryData } from '@/domain/core/dashboard/summary-data';
import { DateIntervalTypes } from '@/domain/core/date-interval-type';
import { Money } from '@/domain/core/money';
import { type AsyncResult } from '@/domain/core/result';
import { Settings } from '@/domain/core/store-items/settings';
import { watchQuery } from '@/domain/persistence/watch-query';

type SummaryDataRow = {
  type: string;
  bucket_date: string;
  total: number;
};

export const DashboardRepositoryInPowersync = (db: AbstractPowerSyncDatabase): DashboardRepository => {
  const getBucketLogic = (settings: Settings) => {
    const { effectiveDate, intervalType, frequency } = settings;

    if (intervalType === DateIntervalTypes.weekly) {
      const days = frequency * 7;
      // Calculate how many 'days' intervals have passed since the anchor date
      return `CAST((julianday(t.date) - julianday('${effectiveDate}')) / ${days} AS INTEGER)`;
    }

    if (intervalType === DateIntervalTypes.monthly) {
      // Calculate total months since anchor, divided by frequency
      return `CAST(((strftime('%Y', t.date) - strftime('%Y', '${effectiveDate}')) * 12 + 
            (strftime('%m', t.date) - strftime('%m', '${effectiveDate}'))) / ${frequency} AS INTEGER)`;
    }

    return 't.date'; // Fallback
  };

  const watch = (onDataChange: (result: AsyncResult<SummaryData[]>) => void, settings: Settings) =>
    watchQuery<SummaryDataRow, SummaryData>(
      db,
      `
        SELECT
          c.type,
          MIN(t.date) as bucket_date,
          SUM(t.amount) as total
        FROM categories c
               INNER JOIN transactions t ON c.id = t.category_id
        WHERE c.system = 0
        GROUP BY c.type, ${getBucketLogic(settings)}
      `,
      [],
      (row) =>
        SummaryData.valid({
          type: row.type,
          date: row.bucket_date,
          total: Money.fromCents(row.total),
        }),
      onDataChange
    );

  return {
    watch: watch,
  };
};
