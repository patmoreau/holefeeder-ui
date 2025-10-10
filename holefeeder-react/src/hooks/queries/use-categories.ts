import { apiService } from '@/services';
import { Category } from '@/types';
import { createListQueryHook, createOneQueryHook } from './use-query';

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
