import { Result } from '@/domain/core/result';
import { FlowsRepository } from '../flows-repository';
import { Tag } from '../tag';

export const WatchTagsUseCase = (repository: FlowsRepository) => {
  const query = (onDataChange: (result: Result<Tag[]>) => void) =>
    repository.watchTags((result: Result<Tag[]>) => {
      if (result.isLoading || result.isFailure) {
        onDataChange(result);
        return;
      }

      onDataChange(result);
    });

  return {
    query: query,
  };
};
