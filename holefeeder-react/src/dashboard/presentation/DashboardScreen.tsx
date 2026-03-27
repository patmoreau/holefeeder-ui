import { router } from 'expo-router';
import React from 'react';
import { NO_SUMMARY } from '@/dashboard/core/watch-summary/watch-summary-use-case';
import { type CardLayout } from '@/dashboard/presentation/components/AccountCard';
import { AccountCardList } from '@/dashboard/presentation/components/AccountCardList';
import { LatestTransactionList } from '@/dashboard/presentation/components/LatestTransactionList';
import { UpcomingCardList } from '@/dashboard/presentation/components/UpcomingCardList';
import { useAccountDetails } from '@/dashboard/presentation/core/use-account-details';
import { useDashboard } from '@/dashboard/presentation/core/use-dashboard';
import { useLatestTransactions } from '@/dashboard/presentation/core/use-latest-transactions';
import { useUpcomingFlows } from '@/dashboard/presentation/core/use-upcoming-flows';
import { DashboardHeaderLargeCard } from '@/dashboard/presentation/DashboardHeaderLargeCard';
import { DashboardHeaderSmallCard } from '@/dashboard/presentation/DashboardHeaderSmallCard';
import { Id } from '@/shared/core/id';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppView } from '@/shared/presentation/AppView';
import { CardHeaderScrollView } from '@/shared/presentation/CardHeaderScrollView';
import { ErrorSheet } from '@/shared/presentation/components/ErrorSheet';
import { useMultipleWatches, withDefault } from '@/shared/presentation/core/use-multiple-watches';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
});

const DashboardScreen = () => {
  const accountsQuery = useAccountDetails();
  const dashboardQuery = useDashboard();
  const upcomingQuery = useUpcomingFlows();
  const latestTransactionsQuery = useLatestTransactions(3);
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const onAccountPress = (id: Id, layout: CardLayout) =>
    router.push({
      pathname: '/(app)/accounts/[id]',
      params: { id: id as string },
    });

  const { data, errors } = useMultipleWatches({
    accounts: withDefault(() => accountsQuery, []),
    dashboard: withDefault(() => dashboardQuery, NO_SUMMARY),
    upcomingFlows: withDefault(() => upcomingQuery, []),
    latestTransactions: withDefault(() => latestTransactionsQuery, []),
  });

  if (errors.showError) {
    return (
      <AppView style={styles.container}>
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const { accounts, dashboard, upcomingFlows, latestTransactions } = data;

  return (
    <CardHeaderScrollView
      headerBackgroundColor={theme.colors.primary}
      largeCard={<DashboardHeaderLargeCard summary={dashboard} />}
      smallCard={<DashboardHeaderSmallCard summary={dashboard} />}
    >
      <AccountCardList accounts={accounts} onPress={onAccountPress} />

      <LatestTransactionList transactions={latestTransactions} />

      <UpcomingCardList upcomingFlows={upcomingFlows} />
    </CardHeaderScrollView>
  );
};

export default DashboardScreen;
