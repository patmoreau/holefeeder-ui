import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { AppField } from '@/features/shared/ui/AppField';
import { AppPicker } from '@/features/shared/ui/AppPicker';

type Props = {
  label: string;
  accounts: Account[];
  selectedAccount: Account;
  onSelectAccount: (account: Account) => void;
};

export function AccountField({ label, accounts, selectedAccount, onSelectAccount }: Props) {
  return (
    <AppField label={label} icon={'creditcard'}>
      <AppPicker
        options={accounts}
        selectedOption={selectedAccount}
        onSelectOption={onSelectAccount}
        onOptionLabel={(account) => account.name}
      />
    </AppField>
  );
}
