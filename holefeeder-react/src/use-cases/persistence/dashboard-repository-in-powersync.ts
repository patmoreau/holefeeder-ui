import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { DashboardRepository } from '@/use-cases/core/dashboard/dashboard-repository';
import { SummaryData } from '@/use-cases/core/dashboard/summary-data';

export const DashboardRepositoryInPowersync = (db: AbstractPowerSyncDatabase): DashboardRepository => {
  const watch = (onDataChange: (result: Result<SummaryData[]>) => void) => {
    const query = db.query<{ type: string; date: string; total: number }>({
      sql: `
        SELECT
          c.type,
          t.date,
          SUM(t.amount) as total
        FROM categories c
               INNER JOIN transactions t ON c.id = t.category_id
        WHERE c.system = 0
        GROUP BY c.type, t.date
        ORDER BY c.type, t.date
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
