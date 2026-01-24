import { Result } from '@/shared/core/result';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { FlowsRepository } from '@/use-cases/core/flows/flows-repository';
import { Transaction } from '@/use-cases/core/flows/transaction';

export type FlowsRepositoryInMemory = FlowsRepository & {};

export const FlowsRepositoryInMemory = (): FlowsRepositoryInMemory => {
  const create = async (purchase: CreateFlowCommand): Promise<Result<Transaction>> => {
    return Result.success({} as Transaction);
  };

  return { create: create };
};
