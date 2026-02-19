import { AbstractPowerSyncDatabase } from '@powersync/common';
import { DashboardRepository } from '@/domain/core/dashboard/dashboard-repository';
import { SummaryData } from '@/domain/core/dashboard/summary-data';
import { DateIntervalType, DateIntervalTypes } from '@/domain/core/date-interval-type';
import { Money } from '@/domain/core/money';
import { type AsyncResult, Result } from '@/domain/core/result';

export const DashboardRepositoryInPowersync = (db: AbstractPowerSyncDatabase): DashboardRepository => {
  const watch = (onDataChange: (result: AsyncResult<SummaryData[]>) => void, intervalType: DateIntervalType, frequency: number) => {
    onDataChange(Result.loading());

    let groupByDate = 't.date';
    if (frequency === 1) {
      if (intervalType === DateIntervalTypes.monthly) {
        groupByDate = "strftime('%Y-%m-01', t.date)";
      } else if (intervalType === DateIntervalTypes.yearly) {
        groupByDate = "strftime('%Y-01-01', t.date)";
      }
    }

    const query = db.query<{ type: string; date: string; total: number }>({
      sql: `
        SELECT
          c.type,
          ${groupByDate} as date,
          SUM(t.amount) as total
        FROM categories c
               INNER JOIN transactions t ON c.id = t.category_id
        WHERE c.system = 0
        GROUP BY c.type, ${groupByDate}
        ORDER BY c.type, ${groupByDate}
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
                    date: row.date,
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
