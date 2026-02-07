import { usePowerSync } from '@powersync/react-native';
import { useEffect, useMemo, useState } from 'react';
import { Result } from '@/shared/core/result';
import { Tag } from '@/use-cases/core/flows/tag';
import { WatchTagsUseCase } from '@/use-cases/core/flows/watch-tags/watch-tags-use-case';
import { FlowsRepositoryInPowersync } from '@/use-cases/persistence/flows-repository-in-powersync';

export const useTags = (): Result<Tag[]> => {
  const db = usePowerSync();
  const [tags, setTags] = useState<Result<Tag[]>>(Result.loading());

  const useCase = useMemo(() => WatchTagsUseCase(FlowsRepositoryInPowersync(db)), [db]);

  useEffect(() => {
    const unsubscribe = useCase.query(setTags);
    return () => unsubscribe();
  }, [useCase]);

  return tags;
};
