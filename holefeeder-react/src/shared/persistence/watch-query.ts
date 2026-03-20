import { AbstractPowerSyncDatabase, QueryParam } from '@powersync/common';
import { type AsyncResult, Result } from '@/shared/core/result';

export const watchQuery = <TRow, T>(
  db: AbstractPowerSyncDatabase,
  sql: string,
  parameters: readonly Readonly<QueryParam>[],
  mapRow: (row: TRow) => T,
  onDataChange: (result: AsyncResult<T[]>) => void
): (() => void) => {
  onDataChange(Result.loading());

  const watcher = db.query<TRow>({ sql, parameters }).watch();

  return watcher.registerListener({
    onData: (data) => onDataChange(!data || data.length === 0 ? Result.success([]) : Result.success(data.map(mapRow))),
    onError: (error) => onDataChange(Result.failure([error.message])),
  });
};

export const WatchQueryErrors = {
  rowNotFound: 'row-not-found',
};

export const watchSingle = <TRow, T>(
  db: AbstractPowerSyncDatabase,
  sql: string,
  parameters: readonly Readonly<QueryParam>[],
  onRow: (row: TRow) => T,
  onDataChange: (result: AsyncResult<T>) => void,
  onEmpty: () => Result<T> = () => Result.failure([WatchQueryErrors.rowNotFound])
): (() => void) => {
  onDataChange(Result.loading());

  const watcher = db.query<TRow>({ sql, parameters }).watch();

  return watcher.registerListener({
    onData: (data) => onDataChange(!data || data.length === 0 ? onEmpty() : Result.success(onRow(data[0]))),
    onError: (error) => onDataChange(Result.failure([error.message])),
  });
};
