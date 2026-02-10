import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { borderRadius, fontWeight, shadows, spacing } from '@/types/theme/design-tokens';
import { Theme } from '@/types/theme/theme';
import { AccountDetail } from '@/use-cases/core/accounts/account-detail';

export type AccountCardProps = ViewProps & {
  account: AccountDetail;
  width?: number;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.secondaryBackground,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginRight: spacing.lg,
      shadowColor: theme.colors.text,
      ...shadows.base,
    },
    header: {
      marginBottom: spacing.lg,
    },
    accountName: {
      ...theme.typography.title,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    lastUpdated: {
      color: theme.colors.secondaryText,
    },
    balanceSection: {
      marginBottom: spacing.lg,
    },
    balanceLabel: {
      ...theme.typography.footnote,
      color: theme.colors.secondaryText,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    balanceAmount: {
      ...theme.typography.largeTitle,
      color: theme.colors.text,
      fontWeight: fontWeight.bold,
    },
    projectedSection: {
      flexDirection: 'row',
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.separator,
    },
    projectedLabel: {
      ...theme.typography.footnote,
      color: theme.colors.secondaryText,
      marginBottom: spacing.xs,
    },
    projectedAmount: {
      ...theme.typography.title,
      fontWeight: fontWeight.semiBold,
    },
    positiveAmount: {
      color: theme.colors.positive,
    },
    negativeAmount: {
      color: theme.colors.negative,
    },
  });

export const AccountCard = ({ account, width = 300, style, ...props }: AccountCardProps) => {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useLocaleFormatter();
  const styles = useStyles(createStyles);
  const balanceSign = account.balance >= 0 ? '' : '-';
  const projectedSign = account.balance >= 0 ? '' : '-';

  return (
    <View style={[styles.card, { width }, style]} {...props}>
      <View style={styles.header}>
        <AppText variant={'title'} adjustsFontSizeToFit>
          {account.name}
        </AppText>
      </View>

      <View style={styles.balanceSection}>
        <AppText variant={'subtitle'}>{t(tk.accountCard.currentBalance)}</AppText>
        <AppText variant={'largeTitle'} adjustsFontSizeToFit>
          {balanceSign}
          {formatCurrency(account.balance)}
        </AppText>
      </View>

      <View style={styles.projectedSection}>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
          <AppText variant={'footnote'}>{t(tk.accountCard.updated)}</AppText>
          <AppText variant={'default'}>{formatDate(account.lastTransactionDate!)}</AppText>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
          <AppText variant={'footnote'}>{t(tk.accountCard.projected)}</AppText>
          <AppText
            variant={'defaultSemiBold'}
            style={[styles.projectedAmount, account.balance >= 0 ? styles.positiveAmount : styles.negativeAmount]}
            adjustsFontSizeToFit
          >
            {projectedSign}
            {formatCurrency(account.projectedBalance)}
          </AppText>
          {account.upcomingVariation !== 0 && (
            <AppText
              variant={'default'}
              style={[
                styles.lastUpdated,
                { marginTop: spacing.xs },
                account.upcomingVariation >= 0 ? styles.positiveAmount : styles.negativeAmount,
              ]}
            >
              {account.upcomingVariation >= 0 ? '+' : ''}
              {formatCurrency(account.upcomingVariation)}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
};
