import { useEffect, useState } from 'react';
import { usePowerSync } from '@/contexts/PowersyncProvider';
import { useSyncStatus } from '@/shared/hooks/use-sync-status';

export const useSyncInfo = () => {
  const { connected, lastSyncedAt, dataFlowStatus } = useSyncStatus();
  const { db } = usePowerSync();
  const [counts, setCounts] = useState<{
    accounts: number;
    cashflows: number;
    categories: number;
    storeItems: number;
    transactions: number;
    outstandingTransactions: number;
  }>({
    accounts: 0,
    cashflows: 0,
    categories: 0,
    storeItems: 0,
    transactions: 0,
    outstandingTransactions: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const accountsResult = await db.getAll<{ count: number }>('SELECT count(*) as count FROM accounts');
        const cashflowsResult = await db.getAll<{ count: number }>('SELECT count(*) as count FROM cashflows');
        const categoriesResult = await db.getAll<{ count: number }>('SELECT count(*) as count FROM categories');
        const storeItemsResult = await db.getAll<{ count: number }>('SELECT count(*) as count FROM store_items');
        const transactionsResult = await db.getAll<{ count: number }>('SELECT count(*) as count FROM transactions');
        const outstandingTransactionsResult = await db.getAll<{ count: number }>('SELECT count(*) as count FROM ps_crud');
        setCounts({
          accounts: accountsResult[0]?.count || 0,
          cashflows: cashflowsResult[0]?.count || 0,
          categories: categoriesResult[0]?.count || 0,
          storeItems: storeItemsResult[0]?.count || 0,
          transactions: transactionsResult[0]?.count || 0,
          outstandingTransactions: outstandingTransactionsResult[0]?.count || 0,
        });
      } catch (e) {
        console.error('Failed to fetch counts', e);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000);
    return () => clearInterval(interval);
  }, [db, lastSyncedAt]);

  return {
    connected,
    lastSyncedAt,
    dataFlowStatus,
    counts,
  };
};
