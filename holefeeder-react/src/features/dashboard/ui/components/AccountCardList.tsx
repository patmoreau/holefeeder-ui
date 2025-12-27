import { ScrollView, View, type ViewProps } from 'react-native';
import { AccountCard } from '@/features/dashboard/ui/components/AccountCard';
import { Account } from '@/features/shared/core/account';
import { useStyles } from '@/shared/hooks/theme/use-styles';

export type AccountCardListProps = ViewProps & {
  accounts: Account[];
  cardWidth?: number;
};

const createStyles = () => ({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
        snapToInterval={cardWidth + 16} // card width + margin
        snapToAlignment="start"
      >
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} width={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
};
