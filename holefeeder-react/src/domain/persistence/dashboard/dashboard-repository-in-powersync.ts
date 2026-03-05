import { AbstractPowerSyncDatabase } from '@powersync/common';
import { DashboardRepository } from '@/domain/core/dashboard/dashboard-repository';
import { SummaryData } from '@/domain/core/dashboard/summary-data';
import { DateIntervalType, DateIntervalTypes } from '@/domain/core/date-interval-type';
import { Money } from '@/domain/core/money';
import { type AsyncResult, Result } from '@/domain/core/result';

export const DashboardRepositoryInPowersync = (db: AbstractPowerSyncDatabase): DashboardRepository => {
  const getBucketLogic = (intervalType: DateIntervalType, frequency: number) => {
    // const { effectiveDate, intervalType, frequency } = settings;
    const effectiveDate = '2014-01-01';

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

  const watch = (onDataChange: (result: AsyncResult<SummaryData[]>) => void, intervalType: DateIntervalType, frequency: number) => {
    onDataChange(Result.loading());

    const bucketSql = getBucketLogic(intervalType, frequency);

    const query = db.query<{ type: string; bucket_date: string; total: number }>({
      sql: `
        SELECT
          c.type,
          MIN(t.date) as bucket_date,
          SUM(t.amount) as total
        FROM categories c
               INNER JOIN transactions t ON c.id = t.category_id
        WHERE c.system = 0
        GROUP BY c.type, ${bucketSql}
        ORDER BY c.type, bucket_date
      `,
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.success([]))
          : onDataChange(
              Result.success(
                data.map((row) =>
                  SummaryData.valid({
                    type: row.type,
                    date: row.bucket_date,
                    total: Money.fromCents(row.total),
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  return {
    watch: watch,
  };
};
