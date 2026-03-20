import React from 'react';
import { Account } from '@/flows/core/accounts/account';
import { AppField } from '@/shared/presentation/AppField';
import { AppPicker } from '@/shared/presentation/components/AppPicker';
import { AppIcons } from '@/types/icons';

type Props = {
  label: string;
  accounts: Account[];
  selectedAccount: Account;
  onSelectAccount: (account: Account) => void;
};

export function AccountField({ label, accounts, selectedAccount, onSelectAccount }: Props) {
  return (
    <AppField label={label} icon={AppIcons.account}>
      <AppPicker
        options={accounts}
        selectedOption={selectedAccount}
        onSelectOption={onSelectAccount}
        onOptionLabel={(account) => account.name}
      />
    </AppField>
  );
}
