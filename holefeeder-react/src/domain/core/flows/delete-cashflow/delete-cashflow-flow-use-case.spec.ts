import { anId } from '@/__tests__/mocks/string-for-test';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { DeleteCashFlowUseCase } from '@/domain/core/flows/delete-cashflow/delete-cashflow-flow-use-case';

describe('deleteCashflowFlowUseCase', () => {
  let repository: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof DeleteCashFlowUseCase>;

  beforeEach(() => {
    repository = FlowsRepositoryInMemory();
    useCase = DeleteCashFlowUseCase(repository);
  });

  it('should pay flow with valid data', async () => {
    const result = await useCase.execute(anId());

    expect(result).toBeSuccessWithValue(undefined);
  });
});
