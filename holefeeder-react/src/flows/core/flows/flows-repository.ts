import { AccountVariation } from '@/flows/core/accounts/account-variation';
import { CashflowVariation } from '@/flows/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/flows/core/flows/create/create-flow-command';
import { PayFlowCommand } from '@/flows/core/flows/pay/pay-flow-command';
import { Tag } from '@/flows/core/flows/tag';
import { Id } from '@/shared/core/id';
import { type AsyncResult, Result } from '@/shared/core/result';

export type FlowsRepository = {
  create(command: CreateFlowCommand): Promise<Result<Id>>;
  pay(command: PayFlowCommand): Promise<Result<Id>>;
  deactivateUpcoming(cashflowId: Id): Promise<Result<void>>;
  watchAccountVariations: (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) => () => void;
  watchCashflowVariations: (onDataChange: (result: AsyncResult<CashflowVariation[]>) => void) => () => void;
  watchTags: (onDataChange: (result: AsyncResult<Tag[]>) => void) => () => void;
};

export const FlowsRepositoryErrors = {
  createFlowCommandFailed: 'create-flow-command-failed',
  payFlowCommandFailed: 'pay-flow-command-failed',
  noTags: 'no-tags',
};
