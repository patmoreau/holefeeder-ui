import { anId } from '@/__tests__/mocks/string-for-test';
import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { Tag } from '@/domain/core/flows/tag';
import { Id } from '@/domain/core/id';
import { type AsyncResult, Result } from '@/domain/core/result';

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
