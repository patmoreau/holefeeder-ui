import { waitFor } from '@testing-library/react-native';
import { aTag } from '@/__tests__/builders/tag-for-test';
import { Result } from '@/shared/core/result';
import { FlowsRepository } from '../flows-repository';
import { Tag } from '../tag';
import { WatchTagsUseCase } from './watch-tags-use-case';

const createMockRepository = (result: Result<Tag[]>): FlowsRepository => ({
  watchTags: jest.fn((onDataChange) => {
    onDataChange(result);
    return jest.fn(); // Return unsubscribe function
  }),
  create: jest.fn(),
});

describe('WatchTagsUseCase', () => {
  it('should return tags when repository succeeds', async () => {
    const tags = [aTag()];
    const repository = createMockRepository(Result.success(tags));
    const useCase = WatchTagsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue(tags);

    unsubscribe();
  });

  it('should return failure when repository fails', async () => {
    const repository = createMockRepository(Result.failure(['error']));
    const useCase = WatchTagsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['error']);

    unsubscribe();
  });

  it('should return loading when repository is loading', async () => {
    const repository = createMockRepository(Result.loading());
    const useCase = WatchTagsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result?.isLoading).toBe(true);

    unsubscribe();
  });

  it('should call repository.watchTags with correct code', () => {
    const repository = createMockRepository(Result.loading());
    const useCase = WatchTagsUseCase(repository);

    useCase.query(jest.fn());

    expect(repository.watchTags).toHaveBeenCalledWith(expect.any(Function));
  });
});
