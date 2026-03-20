import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Tag } from '@/flows/core/flows/tag';
import { WatchTagsUseCase } from '@/flows/core/flows/watch-tags/watch-tags-use-case';
import { type AsyncResult, Result } from '@/shared/core/result';

export const useTags = (): AsyncResult<Tag[]> => {
  const { flowRepository } = useRepositories();
  const [tags, setTags] = useState<AsyncResult<Tag[]>>(Result.loading());

  const useCase = useMemo(() => WatchTagsUseCase(flowRepository), [flowRepository]);

  useEffect(() => {
    const unsubscribe = useCase.watch(setTags);
    return () => unsubscribe();
  }, [useCase]);

  return tags;
};
