import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { Transaction } from '@/domain/core/flows/transaction';
import { Result } from '@/domain/core/result';

export type FlowsRepositoryInMemory = FlowsRepository & {};

export const FlowsRepositoryInMemory = (): FlowsRepositoryInMemory => {
  const create = async (purchase: CreateFlowCommand): Promise<Result<Transaction>> => {
    return Result.success({} as Transaction);
  };

  return { create: create };
};
