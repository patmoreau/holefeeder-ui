import { anId } from '@/__tests__/mocks/string-for-test';
import { AccountVariation } from '@/flows/core/accounts/account-variation';
import { CashflowVariation } from '@/flows/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/flows/core/flows/create/create-flow-command';
import { FlowsRepository } from '@/flows/core/flows/flows-repository';
import { PayFlowCommand } from '@/flows/core/flows/pay/pay-flow-command';
import { Tag } from '@/flows/core/flows/tag';
import { Id } from '@/shared/core/id';
import { type AsyncResult, Result } from '@/shared/core/result';

export type FlowsRepositoryInMemory = FlowsRepository & {
  addAccountVariations: (...items: AccountVariation[]) => void;
  addCashflowVariations: (...items: CashflowVariation[]) => void;
  addTags: (...items: Tag[]) => void;
  isLoading: () => void;
  isFailing: (errors: string[]) => void;
};

export const FlowsRepositoryInMemory = (): FlowsRepositoryInMemory => {
  const accountVariationsInMemory: AccountVariation[] = [];
  const cashflowVariationsInMemory: CashflowVariation[] = [];
  const tagsInMemory: Tag[] = [];
  let loadingInMemory = false;
  let errorsInMemory: string[] = [];

  const create = (_purchase: CreateFlowCommand): Promise<Result<Id>> => {
    return Promise.resolve(Result.success(anId()));
  };

  const pay = (_command: PayFlowCommand): Promise<Result<Id>> => {
    return Promise.resolve(Result.success(anId()));
  };

  const deleteCashflow = (cashflowId: Id): Promise<Result<void>> => {
    return Promise.resolve(Result.success());
  };

  const watchAccountVariations = (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(accountVariationsInMemory));
    }
    return () => void 0;
  };

  const watchCashflowVariations = (onDataChange: (result: AsyncResult<CashflowVariation[]>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(cashflowVariationsInMemory));
    }
    return () => void 0;
  };

  const watchTags = (onDataChange: (result: AsyncResult<Tag[]>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(tagsInMemory));
    }
    return () => void 0;
  };

  const addAccountVariations = (...items: AccountVariation[]) => accountVariationsInMemory.push(...items);
  const addCashflowVariations = (...items: CashflowVariation[]) => cashflowVariationsInMemory.push(...items);
  const addTags = (...items: Tag[]) => tagsInMemory.push(...items);

  const isLoading = () => (loadingInMemory = true);

  const isFailing = (errors: string[]) => (errorsInMemory = errors);

  return {
    create,
    pay,
    deactivateUpcoming: deleteCashflow,
    watchAccountVariations,
    watchCashflowVariations,
    watchTags,
    addAccountVariations,
    addCashflowVariations,
    addTags,
    isLoading,
    isFailing,
  };
};
