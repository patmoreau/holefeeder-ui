import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { DashboardComputedSummary } from '@/features/dashboard/core/use-dashboard-summary';
import { DashboardHeaderExpenseTrend } from '@/features/dashboard/ui/DashboardHeaderExpenseTrend';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  textColor: {
    color: theme.colors.primaryText,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: 'bold' as const,
    color: theme.colors.primaryText,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primaryText,
    opacity: 0.2,
    marginVertical: 16,
  },
  subtitle: {
    color: theme.colors.primaryText,
    opacity: 0.5,
    marginBottom: 4,
  },
});

export const DashboardHeaderLargeCard = ({ summary }: { summary: DashboardComputedSummary }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useLocaleFormatter();
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const netFlow = summary.netFlow;
  const netFlowText = netFlow.isOver ? `+ ${formatCurrency(netFlow.amount)}` : `- ${formatCurrency(Math.abs(netFlow.amount))}`;
  const netFlowColor = netFlow.isOver ? theme.colors.primaryText : theme.colors.secondaryText;

  return (
    <>
      <AppText variant={'title'} style={styles.textColor}>
        {t(tk.dashboard.largeHeader.spendingTitle)}
      </AppText>
      <AppText variant={'largeTitle'} style={styles.largeTitle}>
        {formatCurrency(summary.currentSpending)}
      </AppText>
      <DashboardHeaderExpenseTrend summary={summary} variant="amount" />
      <View style={styles.divider} />
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant={'subtitle'} style={styles.subtitle}>
            {t(tk.dashboard.largeHeader.netFlow)}
          </AppText>
          <AppText style={[{ color: netFlowColor }]}>{netFlowText}</AppText>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant={'subtitle'} style={styles.subtitle}>
            {t(tk.dashboard.largeHeader.totalIncome)}
          </AppText>
          <AppText style={[styles.textColor]}>{formatCurrency(summary.totalIncome)}</AppText>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant={'subtitle'} style={styles.subtitle}>
            {t(tk.dashboard.largeHeader.avgSpending)}
          </AppText>
          <AppText style={[styles.textColor]}>{formatCurrency(summary.averageSpending)}</AppText>
        </View>
      </View>
    </>
  );
};
