import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Tag } from '@/domain/core/flows/tag';
import { WatchTagsUseCase } from '@/domain/core/flows/watch-tags/watch-tags-use-case';
import { type AsyncResult, Result } from '@/domain/core/result';

export const useTags = (): AsyncResult<Tag[]> => {
  const { flowRepository } = useRepositories();
  const [tags, setTags] = useState<AsyncResult<Tag[]>>(Result.loading());

  const useCase = useMemo(() => WatchTagsUseCase(flowRepository), [flowRepository]);

  useEffect(() => {
    const unsubscribe = useCase.query(setTags);
    return () => unsubscribe();
  }, [useCase]);

  return tags;
};
