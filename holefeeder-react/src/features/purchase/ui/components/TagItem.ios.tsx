import { Text, Button } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { useTheme } from '@/shared/hooks/theme/use-theme';

export type TagItemProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  showIcon?: boolean;
};

export function TagItem({ label, selected = false, onPress, showIcon = true }: TagItemProps) {
  const { theme } = useTheme();

  return (
    <Button
      onPress={onPress}
      variant="bordered"
      controlSize="mini"
      color={selected ? theme.colors.primary : theme.colors.secondary}
      modifiers={[padding({ all: 2 })]}
    >
      <Text size={theme.typography.chip.fontSize}>{`#${label}`}</Text>
    </Button>
  );
}
