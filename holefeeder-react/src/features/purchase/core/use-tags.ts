import { tagApi } from '@/features/purchase/api/tag-api';
import { Tag, toTag } from '@/features/purchase/core/tag';
import { createListQueryHook } from '@/shared/hooks/queries/use-query';

const tagQueries = createListQueryHook<Tag>('tags', (token) =>
  tagApi(token)
    .getAll()
    .then((r) => r.data.map(toTag))
);

export const { useList: useTags, keys: tagKeys } = tagQueries;
