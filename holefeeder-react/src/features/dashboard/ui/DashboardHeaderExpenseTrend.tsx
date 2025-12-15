import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { DashboardComputedSummary } from '@/features/dashboard/core/use-dashboard-summary';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';
import { formatCurrency, formatPercentage } from '@/utils/format-currency';

const createStyles = () => ({
  container: {
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
});

export const DashboardHeaderExpenseTrend = ({
  summary,
  variant = 'amount',
}: {
  summary: DashboardComputedSummary;
  variant?: 'amount' | 'percentage';
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const variation = summary.variation;
  const variationText =
    variant === 'amount'
      ? t(tk.dashboard.largeHeader.variation, { variation: formatCurrency(variation.amount) })
      : formatPercentage(variation.percentage);
  const variationColor = variation.isOver ? theme.colors.negative : theme.colors.positive;
  const variationBackgroundColor = variation.isOver ? theme.colors.negativeBackground : theme.colors.positiveBackground;
  const variationIcon = variation.isOver ? AppIcons.trendUp : AppIcons.trendDown;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variationBackgroundColor + '80',
          borderColor: variationBackgroundColor + '90',
        },
      ]}
    >
      <IconSymbol name={variationIcon} color={variationColor} size={14} />
      <AppText style={{ color: variationColor }}>{variationText}</AppText>
    </View>
  );
};
