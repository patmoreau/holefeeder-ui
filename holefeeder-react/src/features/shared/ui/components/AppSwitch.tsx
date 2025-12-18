import React from 'react';
import { Switch, View } from 'react-native';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export const AppSwitch = ({ value, onChange }: Props) => {
  return (
    <View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
};
