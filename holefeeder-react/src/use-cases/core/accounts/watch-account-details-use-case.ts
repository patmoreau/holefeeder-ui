import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { combineWatchers } from '@/shared/core/watch-utils';
import { AccountDetail } from '@/use-cases/core/accounts/account-detail';
import { FlowsRepository } from '@/use-cases/core/flows/flows-repository';
import { Transaction } from '@/use-cases/core/flows/transaction';
import { Account } from './account';
import { AccountsRepository } from './accounts-repository';

export const WatchAccountDetailsUseCase = (accountsRepository: AccountsRepository, flowsRepository: FlowsRepository) => {
  const watchAccounts = (onDataChange: (result: Result<Account[]>) => void) => accountsRepository.watch((result) => onDataChange(result));

  const watchTransactions = (onDataChange: (result: Result<Transaction[]>) => void) =>
    flowsRepository.watchTransactions((result) => onDataChange(result));

  const queryDetails = (onDataChange: (result: Result<AccountDetail[]>) => void) =>
    combineWatchers([watchAccounts, watchTransactions], (accounts: Account[], transactions: Transaction[]) => {
      return accounts.map((account) => {
        const accountTransactions = transactions.filter((transaction) => transaction.accountId === account.id);
        return AccountDetail.valid({
          id: account.id,
          name: account.name,
          balance: Transaction.calculateBalance(account, accountTransactions),
          lastTransactionDate: Transaction.calculateUpdatedDate(account, accountTransactions),
          projectedBalance: Money.ZERO,
          upcomingVariation: Money.ZERO,
        });
      });
    })(onDataChange);

  return {
    queryDetails: queryDetails,
  };
};
