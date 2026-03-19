import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';

export const DeleteCashFlowUseCase = (repository: FlowsRepository) => {
  const execute = async (cashflowId: Id): Promise<Result<void>> => await repository.deleteCashflow(cashflowId);

  return {
    execute: execute,
  };
};
