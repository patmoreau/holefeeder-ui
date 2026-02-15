import { aCreateFlowCommand } from '@/domain/core/__tests__/make-purchase-for-test';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { CreateFlowUseCase } from '@/domain/core/flows/create-flow/create-flow-use-case';

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

    expect(result).toBeSuccessWithValue(expect.anything());
  });
});
