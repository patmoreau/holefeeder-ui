import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';

export const DeactivateUpcomingFlowUseCase = (repository: FlowsRepository) => {
  const execute = async (cashflowId: Id): Promise<Result<void>> => await repository.deactivateUpcoming(cashflowId);

  return {
    execute: execute,
  };
};
