import { waitFor } from '@testing-library/react-native';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { aTag } from '@/domain/core/flows/__tests__/tag-for-test';
import { type AsyncResult } from '@/domain/core/result';
import { WatchTagsUseCase } from './watch-tags-use-case';

describe('WatchTagsUseCase', () => {
  let repository: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof WatchTagsUseCase>;

  beforeEach(() => {
    repository = FlowsRepositoryInMemory();
    useCase = WatchTagsUseCase(repository);
  });

  it('should return tags when repository succeeds', async () => {
    const tag = aTag();
    repository.addTags(tag);

    let result: AsyncResult<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue([tag]);

    unsubscribe();
  });

  it('should return failure when repository fails', async () => {
    repository.isFailing(['error']);

    let result: AsyncResult<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['error']);

    unsubscribe();
  });

  it('should return loading when repository is loading', async () => {
    repository.isLoading();

    let result: AsyncResult<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeLoading();

    unsubscribe();
  });
});
