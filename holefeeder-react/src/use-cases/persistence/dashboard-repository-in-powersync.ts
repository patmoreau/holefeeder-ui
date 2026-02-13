import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { DateIntervalType, DateIntervalTypes } from '@/shared/core/date-interval-type';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { DashboardRepository } from '@/use-cases/core/dashboard/dashboard-repository';
import { SummaryData } from '@/use-cases/core/dashboard/summary-data';

export const DashboardRepositoryInPowersync = (db: AbstractPowerSyncDatabase): DashboardRepository => {
  const watch = (onDataChange: (result: Result<SummaryData[]>) => void, intervalType: DateIntervalType, frequency: number) => {
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
