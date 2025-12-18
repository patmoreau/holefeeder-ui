import { Host, Switch } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import React from 'react';

type Props = {
  value: boolean;
  onChange: (hasCashflow: boolean) => void;
};

export const AppSwitch = ({ value, onChange }: Props) => {
  return (
    <Host matchContents>
      <Switch value={value} onValueChange={onChange} modifiers={[padding({ trailing: 2 })]} />
    </Host>
  );
};
