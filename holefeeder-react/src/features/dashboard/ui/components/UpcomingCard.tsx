import { View, type ViewProps } from 'react-native';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { AppChip } from '@/features/shared/ui/components/AppChip';
import { AppText } from '@/features/shared/ui/components/AppText';
import { today } from '@/features/shared/utils/with-date';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { Theme } from '@/types/theme';
import { shadows, spacing } from '@/types/theme/design-tokens';

export type UpcomingCardProps = ViewProps & {
  upcomingFlow: UpcomingFlow;
};

const createStyles = (theme: Theme) => ({
  card: {
    flex: 1,
    flexDirection: 'row' as const,
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.base,
  },
  cardAmount: {
    flexShrink: 0,
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
  },
  cardDescription: {
    flex: 1,
    flexDirection: 'column' as const,
  },
  tags: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: spacing.xs,
  },
});

export const UpcomingCard = ({ upcomingFlow, style, ...props }: UpcomingCardProps) => {
  const { formatCurrency, formatDate } = useLocaleFormatter();
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.card, style]} {...props}>
      <View style={styles.cardDescription}>
        <AppText variant={'defaultSemiBold'} adjustsFontSizeToFit>
          {upcomingFlow.description}
        </AppText>
        {upcomingFlow.tags.length > 0 && (
          <View style={styles.tags}>
            {upcomingFlow.tags.map((tag) => (
              <AppChip key={tag} selected={true} label={tag} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.cardAmount}>
        <AppText variant={'default'} adjustsFontSizeToFit>
          {formatCurrency(upcomingFlow.amount)}
        </AppText>
        <AppText variant={'footnote'}>{formatDate(upcomingFlow.date, today())}</AppText>
      </View>
    </View>
  );
};
