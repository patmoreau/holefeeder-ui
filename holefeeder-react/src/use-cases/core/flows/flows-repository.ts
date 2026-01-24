import { Result } from '@/shared/core/result';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { Transaction } from '@/use-cases/core/flows/transaction';

export type FlowsRepository = {
  create(command: CreateFlowCommand): Promise<Result<Transaction>>;
};

export const FlowsRepositoryErrors = {
  createFlowCommandFailed: 'create-flow-command-failed',
};
