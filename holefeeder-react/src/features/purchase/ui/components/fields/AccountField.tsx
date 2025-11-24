import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { AppField } from '@/features/shared/ui/AppField';
import { Picker } from '@/features/shared/ui/Picker';

type Props = {
  label: string;
  accounts: Account[];
  selectedAccount: Account;
  onSelectAccount: (account: Account) => void;
};

export function AccountField({ label, accounts, selectedAccount, onSelectAccount }: Props) {
  return (
    <AppField label={label} icon={'creditcard'}>
      <Picker options={accounts} selectedOption={selectedAccount} onSelectOption={onSelectAccount} onOptionLabel={(account) => account.name} />
    </AppField>
  );
}
