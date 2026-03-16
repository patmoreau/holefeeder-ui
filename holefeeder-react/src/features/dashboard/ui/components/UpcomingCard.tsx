import { StyleSheet, View, type ViewProps } from 'react-native';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { AppChip } from '@/features/shared/ui/components/AppChip';
import { AppText } from '@/features/shared/ui/components/AppText';
import { today } from '@/features/shared/utils/with-date';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { borderRadius, shadows, spacing } from '@/types/theme/design-tokens';
import { Theme } from '@/types/theme/theme';

export type UpcomingCardProps = ViewProps & {
  upcomingFlow: UpcomingFlow;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      flexDirection: 'row',
      overflow: 'hidden',
      backgroundColor: theme.colors.secondaryBackground,
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      ...shadows.base,
    },
    cardAmount: {
      flexShrink: 0,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    cardDescription: {
      flex: 1,
      flexDirection: 'column',
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
