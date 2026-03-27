import React from 'react';
import { View, type ViewProps } from 'react-native';
import { TransactionCard } from '@/accounts/presentation/components/TransactionCard';
import { Transaction } from '@/flows/core/flows/transaction';
import { AppCardDivider } from '@/shared/presentation/components/AppCardDivider';
import { AppCardList } from '@/shared/presentation/components/AppCardList';

type TransactionListProps = ViewProps & {
  transactions: Transaction[];
};

export const TransactionList = ({ transactions, ...props }: TransactionListProps) => {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <AppCardList {...props}>
      {transactions.map((transaction, index) => (
        <View key={transaction.id}>
          <TransactionCard transaction={transaction} />
          {index < transactions.length - 1 && <AppCardDivider />}
        </View>
      ))}
    </AppCardList>
  );
};
