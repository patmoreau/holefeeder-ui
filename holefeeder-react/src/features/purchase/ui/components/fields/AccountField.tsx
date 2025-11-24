import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Field } from '@/features/shared/ui/Field';
import { Picker } from '@/features/shared/ui/Picker';

type Props = {
  label: string;
  accounts: Account[];
  selectedAccount: Account;
  onSelectAccount: (account: Account) => void;
};

export function AccountField({ label, accounts, selectedAccount, onSelectAccount }: Props) {
  return (
    <Field label={label} icon={'creditcard'}>
      <Picker options={accounts} selectedOption={selectedAccount} onSelectOption={onSelectAccount} onOptionLabel={(account) => account.name} />
    </Field>
  );
}
