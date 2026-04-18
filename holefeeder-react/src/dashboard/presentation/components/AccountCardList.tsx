import { type ViewProps } from 'react-native';
import { AccountCard, type CardLayout } from '@/dashboard/presentation/components/AccountCard';
import { AccountSummary } from '@/flows/core/accounts/account-summary';
import { Id } from '@/shared/core/id';
import { AppCardList } from '@/shared/presentation/components/AppCardList';

export type AccountCardListProps = ViewProps & {
  accounts: AccountSummary[];
  onPress?: (id: Id, layout: CardLayout) => void;
};

export const AccountCardList = ({ accounts, onPress, style }: AccountCardListProps) => {
  const cardWidth = 300;

  return (
    <AppCardList
      scrollable="horizontal"
      cardWidth={cardWidth}
      style={style}
      data={accounts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AccountCard account={item} width={cardWidth} onPress={onPress} />}
    />
  );
};
