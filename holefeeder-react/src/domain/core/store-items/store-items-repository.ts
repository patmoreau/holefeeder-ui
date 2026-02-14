import { Result } from '@/domain/core/result';
import { StoreItem } from '@/domain/core/store-items/store-item';

export type StoreItemsRepository = {
  watchForCode: (code: string, onDataChange: (result: Result<StoreItem>) => void) => () => void;
  getByCode: (code: string) => Promise<Result<StoreItem>>;
  save: (storeItem: StoreItem) => Promise<Result<void>>;
};

export const StoreItemsRepositoryErrors = {
  storeItemNotFound: 'store-item-not-found',
  saveStoreItemFailed: 'save-store-item-failed',
};
