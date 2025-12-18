import { Button, Text } from '@expo/ui/swift-ui';
import { fixedSize, padding } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { AppChipProps } from '@/features/shared/ui/components/AppChip';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { useTheme } from '@/shared/hooks/theme/use-theme';

export function AppChip({ label, selected = false, onPress }: AppChipProps) {
  const { theme } = useTheme();

  return (
    <AppHost>
      <Button
        onPress={onPress}
        variant="bordered"
        controlSize="mini"
        color={selected ? theme.colors.primary : theme.colors.secondary}
        modifiers={[fixedSize({ horizontal: true, vertical: true }), padding({ all: 2 })]}
      >
        <Text size={theme.typography.chip.fontSize} color={selected ? theme.colors.primary : theme.colors.secondary}>
          {label}
        </Text>
      </Button>
    </AppHost>
  );
}
