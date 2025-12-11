import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { DashboardComputedSummary } from '@/features/dashboard/core/use-dashboard-summary';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.secondaryText,
    opacity: 0.2,
    marginVertical: 16,
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
    backgroundColor: '#fff',
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

export const DashboardHeaderLargeCard = ({ summary }: { summary: DashboardComputedSummary }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  const variation = summary.variation;
  const variationText = variation.isOver
    ? `↑ ${t(tk.dashboard.largeHeader.variationAbove, { variation: formatCurrency(variation.amount) })}`
    : `↓ ${t(tk.dashboard.largeHeader.variationBelow, { variation: formatCurrency(variation.amount) })}`;
  const variationColor = variation.isOver ? theme.colors.primaryText : theme.colors.secondaryText;

  const netFlow = summary.netFlow;
  const netFlowText = netFlow.isOver ? `+ ${formatCurrency(netFlow.amount)}` : `- ${formatCurrency(Math.abs(netFlow.amount))}`;
  const netFlowColor = variation.isOver ? theme.colors.primaryText : theme.colors.secondaryText;

  return (
    <>
      <Text style={styles.smallTitle}>{t(tk.dashboard.largeHeader.spendingTitle)}</Text>
      <Text style={styles.largeTitle}>{formatCurrency(summary.currentSpending)}</Text>
      <Text style={[styles.subtitle, { color: variationColor }]}>{variationText}</Text>
      <View style={styles.divider} />
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.smallTitle]}>{t(tk.dashboard.largeHeader.netFlow)}</Text>
          <Text style={[styles.smallTitle, { color: netFlowColor }]}>{netFlowText}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.smallTitle]}>{t(tk.dashboard.largeHeader.totalIncome)}</Text>
          <Text style={[styles.smallTitle]}>{formatCurrency(summary.totalIncome)}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.smallTitle]}>{t(tk.dashboard.largeHeader.avgSpending)}</Text>
          <Text style={[styles.smallTitle]}>{formatCurrency(summary.averageSpending)}</Text>
        </View>
      </View>
    </>
  );
};
