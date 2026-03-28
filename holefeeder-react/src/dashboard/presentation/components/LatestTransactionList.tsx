import React from 'react';
import { useTranslation } from 'react-i18next';
import { type ViewProps } from 'react-native';
import { LatestTransactionCard } from '@/dashboard/presentation/components/LatestTransactionCard';
import { UseLatestTransactionsResult } from '@/dashboard/presentation/core/use-latest-transactions';
import { tk } from '@/i18n/translations';
import { AppCardDivider } from '@/shared/presentation/components/AppCardDivider';
import { AppCardList } from '@/shared/presentation/components/AppCardList';
import { useMultipleWatches, withDefault } from '@/shared/presentation/core/use-multiple-watches';

export type LatestTransactionListProps = ViewProps & {
  transactionsResult: UseLatestTransactionsResult;
};

export const LatestTransactionList = ({ transactionsResult, style }: LatestTransactionListProps) => {
  const { t } = useTranslation();

  const { transactions: transactionsQuery } = transactionsResult;

  const { data } = useMultipleWatches({
    transactions: withDefault(() => transactionsQuery, []),
  });

  const { transactions } = data;

  if (transactions.length === 0) {
    return null;
  }

  return (
    <AppCardList
      style={style}
      header={t(tk.recentTransactions.title)}
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <LatestTransactionCard transaction={item} />}
      ItemSeparatorComponent={() => <AppCardDivider />}
    />
  );
};
