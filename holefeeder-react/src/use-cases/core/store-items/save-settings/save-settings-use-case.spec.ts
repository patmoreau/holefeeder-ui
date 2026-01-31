import { FlowsRepositoryInMemory } from '@/use-cases/__tests__/flows-repository-in-memory';
import { aCreateFlowCommand } from '@/use-cases/__tests__/make-purchase-for-test';
import { CreateFlowUseCase } from '@/use-cases/core/flows/create-flow/create-flow-use-case';

describe('createFlowUseCase', () => {
  let fakeRepo: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof CreateFlowUseCase>;

  beforeEach(() => {
    fakeRepo = FlowsRepositoryInMemory();
    useCase = CreateFlowUseCase(fakeRepo);
  });

  it('should create flow with valid data', async () => {
    const validFlow = aCreateFlowCommand();
    const result = await useCase.execute(validFlow);

    expect(result).toBeSuccessWithValue({});
  });
});
