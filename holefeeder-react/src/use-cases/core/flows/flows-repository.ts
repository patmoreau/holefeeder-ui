import { Id } from '@/shared/core/id';
import { Result } from '@/shared/core/result';
import { Cashflow } from '@/use-cases/core/flows/cashflow';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { Tag } from '@/use-cases/core/flows/tag';
import { Transaction } from '@/use-cases/core/flows/transaction';

export type FlowsRepository = {
  create(command: CreateFlowCommand): Promise<Result<Id>>;
  watchCashflows: (onDataChange: (result: Result<Cashflow[]>) => void) => () => void;
  watchTransactions: (onDataChange: (result: Result<Transaction[]>) => void) => () => void;
  watchTags: (onDataChange: (result: Result<Tag[]>) => void) => () => void;
};

export const FlowsRepositoryErrors = {
  createFlowCommandFailed: 'create-flow-command-failed',
  noTags: 'no-tags',
};
