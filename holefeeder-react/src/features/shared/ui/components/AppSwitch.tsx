import React from 'react';
import { Switch } from 'react-native';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export const AppSwitch = ({ value, onChange }: Props) => {
  return <Switch value={value} onValueChange={onChange} />;
};
