import { Picker } from '@expo/ui/swift-ui';
import { Account } from '@/core';
import { LoadingIndicator } from './ui';

type Props = {
  accounts: Account[] | null;
  selectedAccount: Account | null;
  onSelectAccount: (account: Account) => void;
};

export function AccountPicker({ accounts, selectedAccount, onSelectAccount }: Props) {
  if (!accounts) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <Picker
      options={accounts.map((category) => category.name)}
      selectedIndex={accounts.findIndex((account) => account.id === selectedAccount?.id)}
      onOptionSelected={({ nativeEvent: { index } }) => {
        onSelectAccount(accounts[index]);
      }}
      variant="menu"
    />
  );
}
