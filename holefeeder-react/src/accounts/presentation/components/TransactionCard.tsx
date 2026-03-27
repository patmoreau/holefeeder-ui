import React from 'react';
import { View, type ViewProps } from 'react-native';
import { CategoryTypes } from '@/flows/core/categories/category-type';
import { Transaction } from '@/flows/core/flows/transaction';
import { today } from '@/shared/core/with-date';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { AppCard } from '@/shared/presentation/components/AppCard';
import { AppChip } from '@/shared/presentation/components/AppChip';
import { AppText } from '@/shared/presentation/components/AppText';
import { Theme } from '@/types/theme';
import { spacing } from '@/types/theme/design-tokens';

export type TransactionCardProps = ViewProps & {
  transaction: Transaction;
};

const createStyles = (theme: Theme) => ({
  cardDescription: {
    flex: 1,
    flexDirection: 'column' as const,
  },
  cardAmount: {
    flexShrink: 0,
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
  },
  tags: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: spacing.xs,
  },
  positiveAmount: {
    color: theme.colors.positive,
  },
  negativeAmount: {
    color: theme.colors.negative,
  },
});

export const TransactionCard = ({ transaction, ...props }: TransactionCardProps) => {
  const { formatCurrency, formatDate } = useLocaleFormatter();
  const styles = useStyles(createStyles);

  const amountStyle = transaction.categoryType === CategoryTypes.gain ? styles.positiveAmount : styles.negativeAmount;

  return (
    <AppCard {...props}>
      <View style={styles.cardDescription}>
        <AppText variant={'defaultSemiBold'} adjustsFontSizeToFit>
          {transaction.description}
        </AppText>
        {transaction.tags.length > 0 && (
          <View style={styles.tags}>
            {transaction.tags.map((tag) => (
              <AppChip key={tag} selected={true} label={tag} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.cardAmount}>
        <AppText variant={'default'} adjustsFontSizeToFit style={amountStyle}>
          {formatCurrency(transaction.amount)}
        </AppText>
        <AppText variant={'footnote'}>{formatDate(transaction.date, today())}</AppText>
      </View>
    </AppCard>
  );
};
