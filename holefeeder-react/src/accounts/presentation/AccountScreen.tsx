import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { AccountHeaderLargeCard } from '@/accounts/presentation/AccountHeaderLargeCard';
import { AccountHeaderSmallCard } from '@/accounts/presentation/AccountHeaderSmallCard';
import { TransactionList } from '@/accounts/presentation/components/TransactionList';
import { useAccountDetail } from '@/accounts/presentation/core/use-account-detail';
import { useTransactions } from '@/accounts/presentation/core/use-transactions';
import { Id } from '@/shared/core/id';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppView } from '@/shared/presentation/AppView';
import { CardHeaderScrollView } from '@/shared/presentation/CardHeaderScrollView';
import { AppButton } from '@/shared/presentation/components/AppButton';
import { ErrorSheet } from '@/shared/presentation/components/ErrorSheet';
import { LoadingIndicator } from '@/shared/presentation/components/LoadingIndicator';
import { useMultipleWatches, withDefault } from '@/shared/presentation/core/use-multiple-watches';
import { goBack } from '@/shared/presentation/navigation';
import { AppIcons } from '@/types/icons';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
});

export const AccountScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accountId = Id.valid(id);
  const { theme } = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useNavigation();

  const accountQuery = useAccountDetail(accountId);
  const transactionsQuery = useTransactions(accountId);

  const { data, errors } = useMultipleWatches({
    account: withDefault(() => accountQuery, null),
    transactions: withDefault(() => transactionsQuery, []),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppButton icon={AppIcons.back} style={{ width: 35, height: 35 }} onPress={() => goBack()} />,
    });
  }, [navigation]);

  if (errors.showError) {
    return (
      <AppView style={styles.container}>
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const { account, transactions } = data;

  if (!account) return <LoadingIndicator />;

  return (
    <CardHeaderScrollView
      headerBackgroundColor={theme.colors.primary}
      largeCard={<AccountHeaderLargeCard account={account} />}
      smallCard={<AccountHeaderSmallCard account={account} />}
    >
      <TransactionList transactions={transactions} />
    </CardHeaderScrollView>
  );
};
