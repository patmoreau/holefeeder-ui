import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';

export type TagItemProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  showIcon?: boolean;
};

const useTagItemStyles = () =>
  useStyles((theme) => ({
    chip: {
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      marginRight: 8,
      marginVertical: 6,
    },
    chipDefault: {
      backgroundColor: '#F4F5F7',
      borderColor: '#DADCE3',
    },
    chipSelected: {
      backgroundColor: '#E6F0FF',
      borderColor: '#2F6FED',
    },
    chipPressed: {
      opacity: 0.85,
    },
    chipContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconText: {
      fontSize: 14,
      marginRight: 6,
    },
    iconDefault: {
      color: '#5F6673',
    },
    iconSelected: {
      color: '#2F6FED',
    },
    labelText: {
      fontSize: 14,
    },
    labelDefault: {
      color: '#1A1F2C',
    },
    labelSelected: {
      color: '#0F3DA3',
      fontWeight: '600',
    },
    chipText: {
      ...theme.typography.chip,
    },
  }));

export function TagItem({ label, selected = false, onPress, showIcon = true }: TagItemProps) {
  const styles = useTagItemStyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected ? styles.chipSelected : styles.chipDefault, pressed ? styles.chipPressed : null]}
    >
      <View style={styles.chipContent}>
        {showIcon && <Text style={[styles.iconText, selected ? styles.iconSelected : styles.iconDefault]}>{selected ? '×' : '+'}</Text>}
        <Text numberOfLines={1} style={[styles.labelText, selected ? styles.labelSelected : styles.labelDefault, styles.chipText]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
