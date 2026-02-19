import { type AsyncResult } from '@/domain/core/result';
import { FlowsRepository } from '../flows-repository';
import { Tag } from '../tag';

export const WatchTagsUseCase = (repository: FlowsRepository) => {
  const query = (onDataChange: (result: AsyncResult<Tag[]>) => void) =>
    repository.watchTags((result: AsyncResult<Tag[]>) => {
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
