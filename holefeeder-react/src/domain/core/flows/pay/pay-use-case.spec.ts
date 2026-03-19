import { aPayFlowCommand } from '@/domain/core/__tests__/pay-flow-command-for-test';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { PayUseCase } from '@/domain/core/flows/pay/pay-use-case';

describe('payFlowUseCase', () => {
  let fakeRepo: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof PayUseCase>;

  beforeEach(() => {
    fakeRepo = FlowsRepositoryInMemory();
    useCase = PayUseCase(fakeRepo);
  });

  it('should pay flow with valid data', async () => {
    const validFlow = aPayFlowCommand();
    const result = await useCase.execute(validFlow);

    expect(result).toBeSuccessWithValue(expect.anything());
  });
});
