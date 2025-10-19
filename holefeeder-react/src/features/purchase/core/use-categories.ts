import { Category } from '@/core/category';
import { createListQueryHook, createOneQueryHook } from '@/shared/hooks/queries/use-query';
import { apiService } from '@/shared/services/api-service';

const categoryQueries = createListQueryHook<Category>('categories', (token) =>
  apiService(token)
    .getCategories()
    .then((r) => r.data)
);

const categoryDetailQueries = createOneQueryHook<Category>('categories', (id, token) =>
  apiService(token)
    .getCategory(id as string)
    .then((r) => r.data)
);

export const { useList: useCategories, keys: categoryKeys } = categoryQueries;

export const { useOne: useCategory, keys: categoryDetailKeys } = categoryDetailQueries;
