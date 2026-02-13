import { Id } from '@/shared/core/id';
import { Result } from '@/shared/core/result';
import { AccountVariation } from '@/use-cases/core/accounts/account-variation';
import { CashflowVariation } from '@/use-cases/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { Tag } from '@/use-cases/core/flows/tag';

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
