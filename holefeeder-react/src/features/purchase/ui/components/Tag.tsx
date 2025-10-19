import React from 'react';
import { View, Text } from 'react-native';
import { useViewStyles, useTextStyles } from '@/shared/hooks/theme/use-styles';

export type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  const viewStyles = useViewStyles();
  const textStyles = useTextStyles();

  return (
    <View style={viewStyles.tag}>
      <Text style={textStyles.tag}>{label}</Text>
    </View>
  );
}
