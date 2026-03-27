import { useEffect, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Transaction } from '@/flows/core/flows/transaction';
import { Id } from '@/shared/core/id';
import { type AsyncResult, Result } from '@/shared/core/result';

export const useTransactions = (accountId: Id, limit = 100): AsyncResult<Transaction[]> => {
  const { flowRepository } = useRepositories();
  const [transactions, setTransactions] = useState<AsyncResult<Transaction[]>>(Result.loading());

  useEffect(() => {
    const unsubscribe = flowRepository.watchAccountTransactions(setTransactions, accountId, limit);
    return () => unsubscribe();
  }, [flowRepository, accountId, limit]);

  return transactions;
};
