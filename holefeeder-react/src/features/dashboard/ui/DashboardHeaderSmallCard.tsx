import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { DashboardComputedSummary } from '@/features/dashboard/core/use-dashboard-summary';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';
import { formatCurrency } from '@/utils/format-currency';

const createStyles = (theme: Theme) => ({
  smallTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: theme.colors.primaryText,
  },
});

export const DashboardHeaderSmallCard = ({ summary }: { summary: DashboardComputedSummary }) => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Text style={styles.smallTitle}>{t(tk.dashboard.smallHeader.spendingTitle)}</Text>
      <Text style={styles.smallTitle}>{formatCurrency(summary.currentSpending)}</Text>
    </View>
  );
};
