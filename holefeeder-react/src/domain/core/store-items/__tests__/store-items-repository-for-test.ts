import { Result } from '@/domain/core/result';
import { StoreItem } from '@/domain/core/store-items/store-item';
import { StoreItemsRepository, StoreItemsRepositoryErrors } from '@/domain/core/store-items/store-items-repository';

export type StoreItemsRepositoryInMemory = StoreItemsRepository & {
  add: (item: StoreItem) => void;
  isLoading: () => void;
  isFailing: (errors: string[]) => void;
};

export const StoreItemsRepositoryInMemory = (): StoreItemsRepositoryInMemory => {
  const items: StoreItem[] = [];
  let _loading = false;
  let _errors: string[] = [];

  const watchForCode = (code: string, onDataChange: (result: Result<StoreItem>) => void) => {
    const item = items.find((item) => item.code === code);
    if (_loading) {
      onDataChange(Result.loading());
    } else if (_errors.length > 0) {
      onDataChange(Result.failure(_errors));
    } else if (item) {
      onDataChange(Result.success(item));
    } else {
      onDataChange(Result.failure([StoreItemsRepositoryErrors.storeItemNotFound]));
    }
    // Return unsubscribe function
    return () => {};
  };

  const getByCode = async (code: string) => {
    const item = items.find((item) => item.code === code);
    if (item) {
      return Result.success(item);
    }
    return Result.failure([StoreItemsRepositoryErrors.storeItemNotFound]);
  };

  const save = (storeItem: StoreItem) => {
    const index = items.findIndex((item) => item.code === storeItem.code);
    if (index >= 0) {
      items[index] = storeItem;
    } else {
      items.push(storeItem);
    }
    return Promise.resolve(Result.success(undefined));
  };

  const add = (item: StoreItem) => items.push(item);

  const isLoading = () => (_loading = true);

  const isFailing = (errors: string[]) => (_errors = errors);

  return { watchForCode: watchForCode, getByCode: getByCode, save: save, add: add, isLoading: isLoading, isFailing: isFailing };
};
