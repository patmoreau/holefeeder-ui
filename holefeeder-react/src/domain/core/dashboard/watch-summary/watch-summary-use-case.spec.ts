import { waitFor } from '@testing-library/react-native';
import { CategoryTypes } from '@/domain/core/categories/category-type';
import { DashboardRepositoryInMemory } from '@/domain/core/dashboard/__tests__/dashboard-repository-in-memory';
import { aSummaryData } from '@/domain/core/dashboard/__tests__/summary-data-for-test';
import { DashboardComputedSummary, WatchSummaryUseCase } from '@/domain/core/dashboard/watch-summary/watch-summary-use-case';
import { DateIntervalTypes } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { aSettings } from '@/domain/core/store-items/__tests__/settings-for-test';
import { withDate } from '@/features/shared/utils/with-date';

describe('WatchCategoriesUseCase', () => {
  const asOfDate = withDate(new Date(Date.now())).toDateOnly((date) => new Date(date.getFullYear(), date.getMonth(), 1));
  const settings = aSettings({
    effectiveDate: DateOnly.valid(withDate(asOfDate).toDateOnly((date) => new Date(date.getFullYear(), date.getMonth(), 1))),
    intervalType: DateIntervalTypes.monthly,
    frequency: 1,
  });
  let repository: DashboardRepositoryInMemory;
  let useCase: ReturnType<typeof WatchSummaryUseCase>;

  beforeEach(() => {
    repository = DashboardRepositoryInMemory();
    useCase = WatchSummaryUseCase(settings, repository);
  });

  it('returns summary when repository succeeds', async () => {
    const expenses = [
      aSummaryData({ date: asOfDate, type: CategoryTypes.expense, total: Money.valid(100) }),
      aSummaryData({ date: asOfDate, type: CategoryTypes.expense, total: Money.valid(200) }),
    ];
    const gains = [
      aSummaryData({ date: asOfDate, type: CategoryTypes.gain, total: Money.valid(1000) }),
      aSummaryData({ date: asOfDate, type: CategoryTypes.gain, total: Money.valid(2000) }),
    ];
    repository.add(...expenses, ...gains);

    let result: Result<DashboardComputedSummary> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue({
      averageSpending: Money.valid(300),
      currentSpending: Money.valid(300),
      variation: {
        amount: 0,
        percentage: 0,
        isOver: false,
      },
      netFlow: {
        amount: Money.valid(2700),
        isOver: true,
      },
      totalIncome: Money.valid(3000),
    });

    unsubscribe();
  });

  it('returns failure when repository fails', async () => {
    repository.isFailing(['error']);

    let result: Result<DashboardComputedSummary> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['error']);

    unsubscribe();
  });

  it('returns loading when repository is loading', async () => {
    repository.isLoading();

    let result: Result<DashboardComputedSummary> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeLoading();

    unsubscribe();
  });
});
