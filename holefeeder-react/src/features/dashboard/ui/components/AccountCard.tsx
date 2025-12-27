import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { Account } from '@/features/shared/core/account';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { Theme } from '@/types/theme/theme';

export type AccountCardProps = ViewProps & {
  account: Account;
  width?: number;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.secondaryBackground,
      borderRadius: 16,
      padding: 16,
      marginRight: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    header: {
      marginBottom: 16,
    },
    accountName: {
      ...theme.typography.title,
      color: theme.colors.text,
      marginBottom: 4,
    },
    lastUpdated: {
      color: theme.colors.secondaryText,
    },
    balanceSection: {
      marginBottom: 16,
    },
    balanceLabel: {
      ...theme.typography.footnote,
      color: theme.colors.secondaryText,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    balanceAmount: {
      ...theme.typography.largeTitle,
      color: theme.colors.text,
      fontWeight: '700',
    },
    projectedSection: {
      flexDirection: 'row',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.separator,
    },
    projectedLabel: {
      ...theme.typography.footnote,
      color: theme.colors.secondaryText,
      marginBottom: 4,
    },
    projectedAmount: {
      ...theme.typography.title,
      fontWeight: '600',
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
          <AppText variant={'default'}>{formatDate(account.updated!)}</AppText>
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
              style={[styles.lastUpdated, { marginTop: 4 }, account.upcomingVariation >= 0 ? styles.positiveAmount : styles.negativeAmount]}
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
