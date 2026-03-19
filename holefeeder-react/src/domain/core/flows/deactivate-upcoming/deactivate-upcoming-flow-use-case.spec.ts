import { anId } from '@/__tests__/mocks/string-for-test';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { DeactivateUpcomingFlowUseCase } from '@/domain/core/flows/deactivate-upcoming/deactivate-upcoming-flow-use-case';

describe('DeactivateUpcomingFlowUseCase', () => {
  let repository: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof DeactivateUpcomingFlowUseCase>;

  beforeEach(() => {
    repository = FlowsRepositoryInMemory();
    useCase = DeactivateUpcomingFlowUseCase(repository);
  });

  it('should pay flow with valid data', async () => {
    const result = await useCase.execute(anId());

    expect(result).toBeSuccessWithValue(undefined);
  });
});
