import { Result } from '@/shared/core/result';
import { Variation } from '@/shared/core/variation';
import { combineWatchers } from '@/shared/core/watch-utils';
import { AccountDetail } from '@/use-cases/core/accounts/account-detail';
import { DateInterval } from '@/use-cases/core/date-interval';
import { Cashflow } from '@/use-cases/core/flows/cashflow';
import { FlowsRepository } from '@/use-cases/core/flows/flows-repository';
import { Transaction } from '@/use-cases/core/flows/transaction';
import { Account } from './account';
import { AccountsRepository } from './accounts-repository';

export const WatchAccountDetailsUseCase = (
  dateInterval: DateInterval,
  accountsRepository: AccountsRepository,
  flowsRepository: FlowsRepository
) => {
  const watchAccounts = (onDataChange: (result: Result<Account[]>) => void) => accountsRepository.watch((result) => onDataChange(result));

  const watchCashflows = (onDataChange: (result: Result<Cashflow[]>) => void) =>
    flowsRepository.watchCashflows((result) => onDataChange(result));

  const watchTransactions = (onDataChange: (result: Result<Transaction[]>) => void) =>
    flowsRepository.watchTransactions((result) => onDataChange(result));

  const queryDetails = (onDataChange: (result: Result<AccountDetail[]>) => void) => {
    return combineWatchers(
      [watchAccounts, watchCashflows, watchTransactions],
      (accounts: Account[], cashflows: Cashflow[], transactions: Transaction[]) =>
        accounts.map((account) => {
          const accountCashflows = cashflows.filter((cashflow) => cashflow.accountId === account.id);
          const accountTransactions = transactions.filter((transaction) => transaction.accountId === account.id);
          const forTransactions = Cashflow.forTransactions(accountTransactions);
          const upcomingVariation = accountCashflows.reduce(
            (acc, curr) => Variation.sum(acc, forTransactions.calculateUpcomingVariation(curr, dateInterval.end)),
            Variation.ZERO
          );
          const balance = Transaction.calculateBalance(account, accountTransactions);
          return AccountDetail.valid({
            id: account.id,
            name: account.name,
            balance: balance,
            lastTransactionDate: Transaction.calculateUpdatedDate(account, accountTransactions),
            projectedBalance: Variation.sum(balance, upcomingVariation),
            upcomingVariation: upcomingVariation,
          });
        })
    )(onDataChange);
  };

  return {
    queryDetails: queryDetails,
  };
};
