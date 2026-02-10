import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Result } from '@/shared/core/result';
import { Tag } from '@/use-cases/core/flows/tag';
import { WatchTagsUseCase } from '@/use-cases/core/flows/watch-tags/watch-tags-use-case';

export const useTags = (): Result<Tag[]> => {
  const { flowRepository } = useRepositories();
  const [tags, setTags] = useState<Result<Tag[]>>(Result.loading());

  const useCase = useMemo(() => WatchTagsUseCase(flowRepository), [flowRepository]);

  useEffect(() => {
    const unsubscribe = useCase.query(setTags);
    return () => unsubscribe();
  }, [useCase]);

  return tags;
};
