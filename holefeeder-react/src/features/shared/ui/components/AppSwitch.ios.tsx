import { Switch } from '@expo/ui/swift-ui';
import React from 'react';
import { View } from 'react-native';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { spacing } from '@/types/theme/design-tokens';

type Props = {
  value: boolean;
  onChange?: (value: boolean) => void;
  readonly?: boolean;
};

export const AppSwitch = ({ value, onChange, readonly }: Props) => {
  return (
    <View pointerEvents={readonly ? 'none' : 'auto'}>
      <AppHost style={{ margin: spacing.xs }}>
        <Switch value={value} onValueChange={onChange} />
      </AppHost>
    </View>
  );
};
