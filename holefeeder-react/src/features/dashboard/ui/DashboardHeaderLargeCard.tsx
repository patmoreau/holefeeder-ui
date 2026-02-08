import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { DashboardHeaderExpenseTrend } from '@/features/dashboard/ui/DashboardHeaderExpenseTrend';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { fontSize, fontWeight, spacing } from '@/types/theme/design-tokens';
import { Theme } from '@/types/theme/theme';
import { DashboardComputedSummary } from '@/use-cases/core/dashboard/watch-summary-use-case';

const createStyles = (theme: Theme) => ({
  textColor: {
    color: theme.colors.primaryText,
  },
  largeTitle: {
    fontSize: fontSize!['3xl'],
    fontWeight: fontWeight.bold,
    color: theme.colors.primaryText,
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primaryText,
    opacity: 0.2,
    marginVertical: spacing.lg,
  },
  subtitle: {
    color: theme.colors.primaryText,
    opacity: 0.5,
    marginBottom: spacing.xs,
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
          <AppText style={[{ color: netFlowColor }]} adjustsFontSizeToFit>
            {netFlowText}
          </AppText>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant={'subtitle'} style={styles.subtitle}>
            {t(tk.dashboard.largeHeader.totalIncome)}
          </AppText>
          <AppText style={[styles.textColor]} adjustsFontSizeToFit>
            {formatCurrency(summary.totalIncome)}
          </AppText>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant={'subtitle'} style={styles.subtitle}>
            {t(tk.dashboard.largeHeader.avgSpending)}
          </AppText>
          <AppText style={[styles.textColor]} adjustsFontSizeToFit>
            {formatCurrency(summary.averageSpending)}
          </AppText>
        </View>
      </View>
    </>
  );
};
