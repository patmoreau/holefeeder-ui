import React from 'react';
import { NO_SUMMARY } from '@/domain/core/dashboard/watch-summary/watch-summary-use-case';
import { useAccountDetails } from '@/features/dashboard/core/use-account-details';
import { AccountCardList } from '@/features/dashboard/ui/components/AccountCardList';
import { UpcomingCardList } from '@/features/dashboard/ui/components/UpcomingCardList';
import { DashboardHeaderLargeCard } from '@/features/dashboard/ui/DashboardHeaderLargeCard';
import { DashboardHeaderSmallCard } from '@/features/dashboard/ui/DashboardHeaderSmallCard';
import { useMultipleWatches, withDefault } from '@/features/shared/core/use-multiple-watches';
import { AppView } from '@/features/shared/ui/AppView';
import { CardHeaderScrollView } from '@/features/shared/ui/CardHeaderScrollView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { useDashboard } from '@/presentation/hooks/dashboard/use-dashboard';
import { useUpcomingFlows } from '@/presentation/hooks/flows/get-upcoming-flows/use-upcoming-flows';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
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
