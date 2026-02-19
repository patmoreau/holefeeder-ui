import { AccountDetail } from '@/domain/core/accounts/account-detail';
import { AccountType } from '@/domain/core/accounts/account-type';
import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { DateInterval } from '@/domain/core/date-interval';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { type AsyncResult } from '@/domain/core/result';
import { Variation } from '@/domain/core/variation';
import { combineWatchers } from '@/domain/core/watch-utils';
import { CategoryType, CategoryTypes } from '../../categories/category-type';
import { Account } from '../account';
import { AccountsRepository } from '../accounts-repository';

export const WatchAccountDetailsUseCase = (
  dateInterval: DateInterval,
  accountsRepository: AccountsRepository,
  flowsRepository: FlowsRepository
) => {
  const mapToAccountDetail = (accountVariations: AccountVariation[], cashflowVariations: CashflowVariation[], dateInterval: DateInterval) => {
    return (account: Account) => {
      const accountBenchmark = accountVariations.find((benchmark) => benchmark.accountId === account.id);
      const lastTransactionDate = accountBenchmark ? accountBenchmark.lastTransactionDate : account.openDate;
      const expenses = Variation.valid(accountBenchmark ? accountBenchmark.expenses : 0);
      const gains = Variation.valid(accountBenchmark ? accountBenchmark.gains : 0);

      const net = Variation.sum(
        Variation.multiply(gains, CategoryType.multiplier[CategoryTypes.gain]),
        Variation.multiply(expenses, CategoryType.multiplier[CategoryTypes.expense])
      );
      const balance = Variation.sum(account.openBalance, Variation.multiply(net, AccountType.multiplier[account.type]));

      const accountCashflows = cashflowVariations.filter((cashflow) => cashflow.accountId === account.id);

      const upcomingVariation = accountCashflows.reduce(
        (acc, curr) => Variation.sum(acc, CashflowVariation.forVariation(curr).calculateUpcomingVariation(dateInterval.end)),
        Variation.ZERO
      );

      return AccountDetail.valid({
        id: account.id,
        name: account.name,
        balance: balance,
        lastTransactionDate: lastTransactionDate,
        projectedBalance: Variation.sum(balance, upcomingVariation),
        upcomingVariation: upcomingVariation,
      });
    };
  };

  const watchAccounts = (onDataChange: (result: AsyncResult<Account[]>) => void) => accountsRepository.watch((result) => onDataChange(result));

  const watchAccountVariations = (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) =>
    flowsRepository.watchAccountVariations((result) => onDataChange(result));

  const watchCashflowVariations = (onDataChange: (result: AsyncResult<CashflowVariation[]>) => void) =>
    flowsRepository.watchCashflowVariations((result) => onDataChange(result));

  const queryDetails = (onDataChange: (result: AsyncResult<AccountDetail[]>) => void) =>
    combineWatchers(
      [watchAccounts, watchAccountVariations, watchCashflowVariations],
      (accounts: Account[], accountVariations: AccountVariation[], cashflowVariations: CashflowVariation[]) =>
        accounts.map(mapToAccountDetail(accountVariations, cashflowVariations, dateInterval))
    )(onDataChange);

  return {
    queryDetails: queryDetails,
  };
};
