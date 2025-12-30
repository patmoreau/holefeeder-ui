import { Switch } from '@expo/ui/swift-ui';
import React from 'react';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { spacing } from '@/types/theme/design-tokens';

type Props = {
  value: boolean;
  onChange: (hasCashflow: boolean) => void;
};

export const AppSwitch = ({ value, onChange }: Props) => {
  return (
    <AppHost style={{ margin: spacing.xs }}>
      <Switch value={value} onValueChange={onChange} />
    </AppHost>
  );
};
