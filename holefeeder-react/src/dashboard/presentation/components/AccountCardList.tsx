import { type ViewProps } from 'react-native';
import { AccountCard, type CardLayout } from '@/dashboard/presentation/components/AccountCard';
import { AccountDetail } from '@/flows/core/accounts/account-detail';
import { Id } from '@/shared/core/id';
import { AppCardList } from '@/shared/presentation/components/AppCardList';

export type AccountCardListProps = ViewProps & {
  accounts: AccountDetail[];
  onPress?: (id: Id, layout: CardLayout) => void;
};

export const AccountCardList = ({ accounts, onPress, style, ...props }: AccountCardListProps) => {
  const cardWidth = 300;

  return (
    <AppCardList scrollable={'horizontal'} cardWidth={cardWidth} style={style} {...props}>
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} width={cardWidth} onPress={onPress} />
      ))}
    </AppCardList>
  );
};
