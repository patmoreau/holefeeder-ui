import { type ViewProps } from 'react-native';
import { AccountCard } from '@/dashboard/presentation/components/AccountCard';
import { AccountDetail } from '@/flows/core/accounts/account-detail';
import { AppCardList } from '@/shared/presentation/components/AppCardList';

export type AccountCardListProps = ViewProps & {
  accounts: AccountDetail[];
};

export const AccountCardList = ({ accounts, style, ...props }: AccountCardListProps) => {
  const cardWidth = 300;

  return (
    <AppCardList scrollable={'horizontal'} cardWidth={cardWidth} style={style} {...props}>
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} width={cardWidth} />
      ))}
    </AppCardList>
  );
};
