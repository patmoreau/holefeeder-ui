import { ScrollView, View, type ViewProps } from 'react-native';
import { AccountCard } from '@/features/dashboard/ui/components/AccountCard';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { spacing } from '@/types/theme/design-tokens';
import { AccountDetail } from '@/use-cases/core/accounts/account-detail';

export type AccountCardListProps = ViewProps & {
  accounts: AccountDetail[];
  cardWidth?: number;
};

const createStyles = () => ({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});

export const AccountCardList = ({ accounts, cardWidth = 300, style, ...props }: AccountCardListProps) => {
  const styles = useStyles(createStyles);

  return (
    <View style={style} {...props}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={cardWidth + spacing.lg} // card width + margin
        snapToAlignment="start"
      >
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} width={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
};
