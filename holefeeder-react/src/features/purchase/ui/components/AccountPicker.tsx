import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, View } from 'react-native';
import { Account } from '@/features/purchase/core/account';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

type Props = {
  accounts: Account[] | null;
  selectedAccount: Account | null;
  onSelectAccount: (category: Account) => void;
};

const createStyles = (theme: Theme) => ({
  picker: {
    ...theme.styles.components.picker,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.separator,
  },
  pickerItem: {
    ...theme.styles.components.pickerItem,
    ...Platform.select({
      web: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      },
      default: {},
    }),
  },
});

export function AccountPicker({ accounts, selectedAccount, onSelectAccount }: Props) {
  const styles = useStyles(createStyles);

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
        style={styles.picker}
        selectedValue={selectedAccount?.id}
        onValueChange={(itemValue: string | number) => {
          const selected = accounts.find((cat) => cat.id === itemValue);
          if (selected) {
            onSelectAccount(selected);
          }
        }}
      >
        {accounts.map((account) => (
          <Picker.Item key={account.id} label={account.name} value={account.id} style={styles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
