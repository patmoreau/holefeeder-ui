import { DashboardRepository } from '@/domain/core/dashboard/dashboard-repository';
import { SummaryData } from '@/domain/core/dashboard/summary-data';
import { type AsyncResult, Result } from '@/domain/core/result';

export type DashboardRepositoryInMemory = DashboardRepository & {
  add: (...items: SummaryData[]) => void;
  isLoading: () => void;
  isFailing: (errors: string[]) => void;
};

export const DashboardRepositoryInMemory = (): DashboardRepositoryInMemory => {
  const itemsInMemory: SummaryData[] = [];
  let loadingInMemory = false;
  let errorsInMemory: string[] = [];

  const watch = (onDataChange: (result: AsyncResult<SummaryData[]>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(itemsInMemory));
    }
    // Return unsubscribe function
    return () => {};
  };

  const add = (...items: SummaryData[]) => itemsInMemory.push(...items);

  const isLoading = () => (loadingInMemory = true);

  const isFailing = (errors: string[]) => (errorsInMemory = errors);

  return { watch: watch, add: add, isLoading: isLoading, isFailing: isFailing };
};
