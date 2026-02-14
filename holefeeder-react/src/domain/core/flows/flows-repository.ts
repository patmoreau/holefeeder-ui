import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { Tag } from '@/domain/core/flows/tag';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';

export type FlowsRepository = {
  create(command: CreateFlowCommand): Promise<Result<Id>>;
  watchAccountVariations: (onDataChange: (result: Result<AccountVariation[]>) => void) => () => void;
  watchCashflowVariations: (onDataChange: (result: Result<CashflowVariation[]>) => void) => () => void;
  watchTags: (onDataChange: (result: Result<Tag[]>) => void) => () => void;
};

export const FlowsRepositoryErrors = {
  createFlowCommandFailed: 'create-flow-command-failed',
  noTags: 'no-tags',
};
