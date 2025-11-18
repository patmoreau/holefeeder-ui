import React from 'react';
import { ViewProps } from 'react-native';
import { ThemedText, ThemedTextProps } from '@/features/shared/ui/components/ThemedText';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

type ScreenTitleProps = {
  title: string;
  viewProps?: ViewProps;
  textProps?: ThemedTextProps;
};

const createStyles = (theme: Theme) => ({
  titleContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
    padding: 32,
  },
});

export const ScreenTitle = ({ title, viewProps, textProps }: ScreenTitleProps) => {
  const styles = useStyles(createStyles);

  return (
    <ThemedView style={styles.titleContainer} {...viewProps}>
      <ThemedText variant="title" {...textProps}>
        {title}
      </ThemedText>
    </ThemedView>
  );
};
