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
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: 'bold' as const,
    color: theme.colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    opacity: 0.8,
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: theme.colors.primaryText,
  },
  contentCard: {
    backgroundColor: theme.colors.secondaryBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
    color: '#333',
  },
  contentText: {
    fontSize: 14,
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

  return (
    <CardHeaderScrollView
      headerBackgroundColor={theme.colors.primary}
      largeCard={<DashboardHeaderLargeCard summary={summary!} />}
      smallCard={<DashboardHeaderSmallCard summary={summary!} />}
    >
      <AccountCardList accounts={accounts!} cardWidth={300} />

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
