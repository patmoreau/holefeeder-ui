import React from 'react';
import { NO_SUMMARY } from '@/dashboard/core/watch-summary/watch-summary-use-case';
import { AccountCardList } from '@/dashboard/presentation/components/AccountCardList';
import { UpcomingCardList } from '@/dashboard/presentation/components/UpcomingCardList';
import { useAccountDetails } from '@/dashboard/presentation/core/use-account-details';
import { useDashboard } from '@/dashboard/presentation/core/use-dashboard';
import { useUpcomingFlows } from '@/dashboard/presentation/core/use-upcoming-flows';
import { DashboardHeaderLargeCard } from '@/dashboard/presentation/DashboardHeaderLargeCard';
import { DashboardHeaderSmallCard } from '@/dashboard/presentation/DashboardHeaderSmallCard';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppView } from '@/shared/presentation/AppView';
import { CardHeaderScrollView } from '@/shared/presentation/CardHeaderScrollView';
import { ErrorSheet } from '@/shared/presentation/components/ErrorSheet';
import { useMultipleWatches, withDefault } from '@/shared/presentation/core/use-multiple-watches';
import { fontSize, fontWeight, spacing } from '@/types/theme/design-tokens';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
  largeTitle: {
    ...theme.typography.largeTitle,
    color: theme.colors.primaryText,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize!.md,
    color: theme.colors.secondaryText,
    opacity: 0.8,
  },
  smallTitle: {
    fontSize: fontSize!.lg,
    fontWeight: fontWeight.semiBold,
    color: theme.colors.primaryText,
  },
});

const DashboardScreen = () => {
  const accountsQuery = useAccountDetails();
  const dashboardQuery = useDashboard();
  const upcomingQuery = useUpcomingFlows();
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const { data, errors } = useMultipleWatches({
    accounts: withDefault(() => accountsQuery, []),
    dashboard: withDefault(() => dashboardQuery, NO_SUMMARY),
    upcomingFlows: withDefault(() => upcomingQuery, []),
  });

  if (errors.showError) {
    return (
      <AppView style={styles.container}>
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const { accounts, dashboard, upcomingFlows } = data;

  return (
    <CardHeaderScrollView
      headerBackgroundColor={theme.colors.primary}
      largeCard={<DashboardHeaderLargeCard summary={dashboard} />}
      smallCard={<DashboardHeaderSmallCard summary={dashboard} />}
    >
      <AccountCardList accounts={accounts} cardWidth={300} />

      <UpcomingCardList upcomingFlows={upcomingFlows} />
    </CardHeaderScrollView>
  );
};

export default DashboardScreen;
