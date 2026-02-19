import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { Tag } from '@/domain/core/flows/tag';
import { Id } from '@/domain/core/id';
import { type AsyncResult, Result } from '@/domain/core/result';

export type FlowsRepository = {
  create(command: CreateFlowCommand): Promise<Result<Id>>;
  watchAccountVariations: (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) => () => void;
  watchCashflowVariations: (onDataChange: (result: AsyncResult<CashflowVariation[]>) => void) => () => void;
  watchTags: (onDataChange: (result: AsyncResult<Tag[]>) => void) => () => void;
};

export const FlowsRepositoryErrors = {
  createFlowCommandFailed: 'create-flow-command-failed',
  noTags: 'no-tags',
};
