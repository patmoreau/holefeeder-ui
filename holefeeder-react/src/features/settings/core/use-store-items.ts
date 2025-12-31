import { storeItemApi, StoreItemFilter } from '@/features/settings/api/store-item-api';
import { StoreItem } from '@/features/settings/core/store-item';
import { createPaginatedQueryHook } from '@/shared/hooks/queries/use-query';

const storeItemQueries = createPaginatedQueryHook<StoreItem, StoreItemFilter>('store-items', (queryParams, token) =>
  storeItemApi(token)
    .query(queryParams)
    .then((r) => r.data)
);

export const { usePaginated: useStoreItems, keys: storeItemKeys } = storeItemQueries;
