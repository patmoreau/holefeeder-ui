import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { DashboardComputedSummary } from '@/features/dashboard/core/use-dashboard-summary';
import { DashboardHeaderExpenseTrend } from '@/features/dashboard/ui/DashboardHeaderExpenseTrend';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  text: {
    color: theme.colors.primaryText,
  },
});

export const DashboardHeaderSmallCard = ({ summary }: { summary: DashboardComputedSummary }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useLocaleFormatter();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{t(tk.dashboard.smallHeader.spendingTitle)}</AppText>
      <AppText style={styles.text}>{formatCurrency(summary.currentSpending)}</AppText>
      <DashboardHeaderExpenseTrend summary={summary} variant="percentage" />
    </View>
  );
};
