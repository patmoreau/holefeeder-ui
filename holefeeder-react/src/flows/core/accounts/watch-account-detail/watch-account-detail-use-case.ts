import { AccountDetail } from '@/flows/core/accounts/account-detail';
import { AccountsRepository } from '@/flows/core/accounts/accounts-repository';
import { FlowsRepository } from '@/flows/core/flows/flows-repository';
import { DateInterval } from '@/shared/core/date-interval';
import { Id } from '@/shared/core/id';
import { type AsyncResult, Result } from '@/shared/core/result';
import { WatchAccountDetailsUseCase } from '../watch-account-details/watch-account-details-use-case';

export const WatchAccountDetailErrors = {
  notFound: 'account-not-found',
};

export const WatchAccountDetailUseCase = (
  id: Id,
  dateInterval: DateInterval,
  accountsRepository: AccountsRepository,
  flowsRepository: FlowsRepository
) => {
  const baseUseCase = WatchAccountDetailsUseCase(dateInterval, accountsRepository, flowsRepository);

  const watchDetail = (onDataChange: (result: AsyncResult<AccountDetail>) => void) =>
    baseUseCase.watchDetails((result) => {
      if (result.isLoading) {
        onDataChange(Result.loading());
        return;
      }
      if (result.isFailure) {
        onDataChange(Result.failure(result.errors));
        return;
      }
      const found = result.value.find((a) => a.id === id);
      if (!found) {
        onDataChange(Result.failure([WatchAccountDetailErrors.notFound]));
      } else {
        onDataChange(Result.success(found));
      }
    });

  return { watchDetail };
};
