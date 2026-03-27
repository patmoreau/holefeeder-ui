import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, type ViewProps } from 'react-native';
import { LatestTransactionCard } from '@/dashboard/presentation/components/LatestTransactionCard';
import { Transaction } from '@/flows/core/flows/transaction';
import { tk } from '@/i18n/translations';
import { AppCardDivider } from '@/shared/presentation/components/AppCardDivider';
import { AppCardList } from '@/shared/presentation/components/AppCardList';

export type LatestTransactionListProps = ViewProps & {
  transactions: Transaction[];
};

export const LatestTransactionList = ({ transactions, ...props }: LatestTransactionListProps) => {
  const { t } = useTranslation();

  if (transactions.length === 0) {
    return null;
  }

  return (
    <AppCardList {...props} header={t(tk.recentTransactions.title)}>
      {transactions.map((transaction, index) => (
        <View key={transaction.id}>
          <LatestTransactionCard transaction={transaction} />
          {index < transactions.length - 1 && <AppCardDivider />}
        </View>
      ))}
    </AppCardList>
  );
};
