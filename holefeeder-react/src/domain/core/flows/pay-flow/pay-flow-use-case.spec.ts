import { aPayFlowCommand } from '@/domain/core/__tests__/pay-flow-command-for-test';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { PayFlowUseCase } from '@/domain/core/flows/pay-flow/pay-flow-use-case';

describe('payFlowUseCase', () => {
  let fakeRepo: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof PayFlowUseCase>;

  beforeEach(() => {
    fakeRepo = FlowsRepositoryInMemory();
    useCase = PayFlowUseCase(fakeRepo);
  });

  it('should pay flow with valid data', async () => {
    const validFlow = aPayFlowCommand();
    const result = await useCase.execute(validFlow);

    expect(result).toBeSuccessWithValue(expect.anything());
  });
});
