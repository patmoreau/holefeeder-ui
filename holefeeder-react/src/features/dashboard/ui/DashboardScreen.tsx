import React from 'react';
import { Text, View } from 'react-native';
import { useDashboardComputedSummary } from '@/features/dashboard/core/use-dashboard-summary';
import { AccountCardList } from '@/features/dashboard/ui/components/AccountCardList';
import { DashboardHeaderLargeCard } from '@/features/dashboard/ui/DashboardHeaderLargeCard';
import { DashboardHeaderSmallCard } from '@/features/dashboard/ui/DashboardHeaderSmallCard';
import { useAccounts } from '@/features/purchase/core/use-accounts';
import { AppView } from '@/features/shared/ui/AppView';
import { CardHeaderScrollView } from '@/features/shared/ui/CardHeaderScrollView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useDataFetchingErrorHandler } from '@/shared/hooks/use-data-fetching-error-handler';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/types/theme/design-tokens';
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
  contentCard: {
    backgroundColor: theme.colors.secondaryBackground,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.base,
  },
  contentTitle: {
    fontSize: fontSize!.lg,
    fontWeight: fontWeight.semiBold,
    marginBottom: spacing.sm,
    color: '#333',
  },
  contentText: {
    fontSize: fontSize!.base,
    color: '#666',
    lineHeight: 20,
  },
});

const DashboardScreen = () => {
  const accountsQuery = useAccounts();
  const dashboardQuery = useDashboardComputedSummary();
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const { isLoading, data, errorSheetProps } = useDataFetchingErrorHandler(accountsQuery, dashboardQuery);

  if (isLoading || !data) {
    return (
      <AppView style={styles.container}>
        <LoadingIndicator />
        <ErrorSheet {...errorSheetProps} />
      </AppView>
    );
  }

  const [accounts, summary] = data!;

  const handleRefresh = () => {
    accountsQuery.refetch();
    dashboardQuery.refetch();
  };

  const isRefreshing = accountsQuery.isFetching || dashboardQuery.isFetching;

  return (
    <CardHeaderScrollView
      headerBackgroundColor={theme.colors.primary}
      largeCard={<DashboardHeaderLargeCard summary={summary!} />}
      smallCard={<DashboardHeaderSmallCard summary={summary!} />}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
    >
      <AccountCardList accounts={accounts!} />

      {Array.from({ length: 20 }).map((_, i) => (
        <View key={i} style={styles.contentCard}>
          <Text style={styles.contentTitle}>Item {i + 1}</Text>
          <Text style={styles.contentText}>This is some content that you can scroll through to see the header morph animation.</Text>
        </View>
      ))}
    </CardHeaderScrollView>
  );
};

export default DashboardScreen;
