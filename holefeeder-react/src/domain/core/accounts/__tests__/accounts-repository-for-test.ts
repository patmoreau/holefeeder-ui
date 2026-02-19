import { Account } from '@/domain/core/accounts/account';
import { AccountsRepository } from '@/domain/core/accounts/accounts-repository';
import { type AsyncResult, Result } from '@/domain/core/result';

export type AccountsRepositoryInMemory = AccountsRepository & {
  add: (...items: Account[]) => void;
  isLoading: () => void;
  isFailing: (errors: string[]) => void;
};

export const AccountsRepositoryInMemory = (): AccountsRepositoryInMemory => {
  const itemsInMemory: Account[] = [];
  let loadingInMemory = false;
  let errorsInMemory: string[] = [];

  const watch = (onDataChange: (result: AsyncResult<Account[]>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(itemsInMemory));
    }
    // Return unsubscribe function
    return () => {};
  };

  const add = (...items: Account[]) => itemsInMemory.push(...items);

  const isLoading = () => (loadingInMemory = true);

  const isFailing = (errors: string[]) => (errorsInMemory = errors);

  return { watch: watch, add: add, isLoading: isLoading, isFailing: isFailing };
};
