import { categoryApi } from '@/features/purchase/api/category-api';
import { Category } from '@/features/purchase/core/category';
import { createListQueryHook, createOneQueryHook } from '@/shared/hooks/queries/use-query';

const categoryQueries = createListQueryHook<Category>('categories', (token) =>
  categoryApi(token)
    .getAll()
    .then((r) => r.data)
);

const categoryDetailQueries = createOneQueryHook<Category>('categories', (id, token) =>
  categoryApi(token)
    .getById(id as string)
    .then((r) => r.data)
);

export const { useList: useCategories, keys: categoryKeys } = categoryQueries;

export const { useOne: useCategory, keys: categoryDetailKeys } = categoryDetailQueries;
