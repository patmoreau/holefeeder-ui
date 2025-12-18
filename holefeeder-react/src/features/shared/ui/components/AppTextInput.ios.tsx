import { TextField } from '@expo/ui/swift-ui';
import * as React from 'react';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { AppTextInputProps } from '@/features/shared/ui/components/AppTextInput';

export const AppTextInput = ({ placeholder, value, onChangeText }: AppTextInputProps) => {
  return (
    <AppHost style={{ flex: 1, width: '100%' }}>
      <TextField defaultValue={value} autocorrection={false} onChangeText={onChangeText} placeholder={placeholder} />
    </AppHost>
  );
};
