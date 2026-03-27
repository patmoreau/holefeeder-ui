import { AccountVariation } from '@/flows/core/accounts/account-variation';
import { CashflowVariation } from '@/flows/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/flows/core/flows/create/create-flow-command';
import { PayFlowCommand } from '@/flows/core/flows/pay/pay-flow-command';
import { Tag } from '@/flows/core/flows/tag';
import { Transaction } from '@/flows/core/flows/transaction';
import { TransferFlowCommand } from '@/flows/core/flows/transfer/transfer-flow-command';
import { Id } from '@/shared/core/id';
import { type AsyncResult, Result } from '@/shared/core/result';

export type FlowsRepository = {
  create(command: CreateFlowCommand): Promise<Result<Id>>;
  pay(command: PayFlowCommand): Promise<Result<Id>>;
  deactivateUpcoming(cashflowId: Id): Promise<Result<void>>;
  transfer(command: TransferFlowCommand): Promise<Result<void>>;
  watchAccountVariations: (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) => () => void;
  watchCashflowVariations: (onDataChange: (result: AsyncResult<CashflowVariation[]>) => void) => () => void;
  watchLatestTransactions: (onDataChange: (result: AsyncResult<Transaction[]>) => void, limit: number) => () => void;
  watchAccountTransactions: (onDataChange: (result: AsyncResult<Transaction[]>) => void, accountId: Id, limit: number) => () => void;
  watchTags: (onDataChange: (result: AsyncResult<Tag[]>) => void) => () => void;
};

export const FlowsRepositoryErrors = {
  createFlowCommandFailed: 'create-flow-command-failed',
  payFlowCommandFailed: 'pay-flow-command-failed',
  noTags: 'no-tags',
};
