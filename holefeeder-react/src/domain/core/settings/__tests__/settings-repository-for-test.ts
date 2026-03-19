import { type AsyncResult, Result } from '@/domain/core/result';
import { DataMetrics } from '@/domain/core/settings/data-metrics';
import { SettingsRepository } from '@/domain/core/settings/settings-repository';

export type SettingsRepositoryInMemory = SettingsRepository & {
  add: (...items: DataMetrics[]) => void;
  isLoading: () => void;
  isFailing: (errors: string[]) => void;
};

export const SettingsRepositoryInMemory = (): SettingsRepositoryInMemory => {
  const itemsInMemory: DataMetrics[] = [];
  let loadingInMemory = false;
  let errorsInMemory: string[] = [];

  const watchDataMetrics = (onDataChange: (result: AsyncResult<DataMetrics>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(itemsInMemory[0]));
    }
    // Return unsubscribe function
    return () => {};
  };

  const add = (...items: DataMetrics[]) => itemsInMemory.push(...items);

  const isLoading = () => (loadingInMemory = true);

  const isFailing = (errors: string[]) => (errorsInMemory = errors);

  return { watchDataMetrics: watchDataMetrics, add: add, isLoading: isLoading, isFailing: isFailing };
};
