import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View } from 'react-native';
import { Account } from '@/core/account';
import { useTextStyles } from '@/hooks/theme/use-styles';
import { LoadingIndicator } from './ui/LoadingIndicator';

type Props = {
  accounts: Account[] | null;
  selectedAccount: Account | null;
  onSelectAccount: (category: Account) => void;
};

export function AccountPicker({ accounts, selectedAccount, onSelectAccount }: Props) {
  const textStyles = useTextStyles();

  if (!accounts) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Picker
        style={textStyles.picker}
        selectedValue={selectedAccount?.id}
        onValueChange={(itemValue: string | number) => {
          const selected = accounts.find((cat) => cat.id === itemValue);
          if (selected) {
            onSelectAccount(selected);
          }
        }}
      >
        {accounts.map((account) => (
          <Picker.Item key={account.id} label={account.name} value={account.id} style={textStyles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
