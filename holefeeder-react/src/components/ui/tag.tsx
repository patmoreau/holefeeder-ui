import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants';
import { useTheme } from '@/hooks/theme/use-theme';

export type TagProps = {
  label: string;
};

export const Tag: React.FC<TagProps> = ({ label }) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={{
        backgroundColor: themeColors.tint,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: isDark ? '#fff' : '#fff',
          fontSize: 14,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </View>
  );
};
