import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';
import { PayFlowCommand } from './pay-flow-command';

export const PayFlowUseCase = (repository: FlowsRepository) => {
  const execute = async (flow: PayFlowCommand): Promise<Result<Id>> => await repository.pay(flow);

  return {
    execute: execute,
  };
};
