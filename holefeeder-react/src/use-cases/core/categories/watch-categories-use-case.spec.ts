import { waitFor } from '@testing-library/react-native';
import { aCategory } from '@/__tests__/builders/category-for-test';
import { Result } from '@/shared/core/result';
import { CategoriesRepository } from './categories-repository';
import { Category } from './category';
import { WatchCategoriesUseCase } from './watch-categories-use-case';

const createMockRepository = (result: Result<Category[]>): CategoriesRepository => ({
  watch: jest.fn((onDataChange) => {
    onDataChange(result);
    return jest.fn(); // Return unsubscribe function
  }),
});

describe('WatchCategoriesUseCase', () => {
  it('should return categories when repository succeeds', async () => {
    const categories = [aCategory()];
    const repository = createMockRepository(Result.success(categories));
    const useCase = WatchCategoriesUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue(categories);

    unsubscribe();
  });

  it('should return failure when repository fails', async () => {
    const repository = createMockRepository(Result.failure(['error']));
    const useCase = WatchCategoriesUseCase(repository);

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
    const useCase = WatchCategoriesUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result?.isLoading).toBe(true);

    unsubscribe();
  });

  it('should call repository.watchForCode with correct code', () => {
    const repository = createMockRepository(Result.loading());
    const useCase = WatchCategoriesUseCase(repository);

    useCase.query(jest.fn());

    expect(repository.watch).toHaveBeenCalledWith(expect.any(Function));
  });
});
