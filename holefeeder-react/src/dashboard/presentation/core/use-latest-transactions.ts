import { useEffect, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Transaction } from '@/flows/core/flows/transaction';
import { type AsyncResult, Result } from '@/shared/core/result';

export const useLatestTransactions = (limit = 3): AsyncResult<Transaction[]> => {
  const { flowRepository } = useRepositories();
  const [transactions, setTransactions] = useState<AsyncResult<Transaction[]>>(Result.loading());

  useEffect(() => {
    const unsubscribe = flowRepository.watchLatestTransactions(setTransactions, limit);
    return () => unsubscribe();
  }, [flowRepository, limit]);

  return transactions;
};
