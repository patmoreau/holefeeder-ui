import { waitFor } from '@testing-library/react-native';
import { CategoriesRepositoryInMemory } from '@/domain/core/categories/__tests__/categories-repository-for-test';
import { aCategory } from '@/domain/core/categories/__tests__/category-for-test';
import { Result } from '@/domain/core/result';
import { WatchCategoriesUseCase } from './watch-categories-use-case';

describe('WatchCategoriesUseCase', () => {
  let repository: CategoriesRepositoryInMemory;
  let useCase: ReturnType<typeof WatchCategoriesUseCase>;

  beforeEach(() => {
    repository = CategoriesRepositoryInMemory();
    useCase = WatchCategoriesUseCase(repository);
  });

  it('returns categories when repository succeeds', async () => {
    const category = aCategory();
    repository.add(category);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue([category]);

    unsubscribe();
  });

  it('returns failure when repository fails', async () => {
    repository.isFailing(['error']);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['error']);

    unsubscribe();
  });

  it('returns loading when repository is loading', async () => {
    repository.isLoading();

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeLoading();

    unsubscribe();
  });
});
