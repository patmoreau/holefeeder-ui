import React from 'react';
import { ViewProps } from 'react-native';
import { ThemedText, ThemedTextProps } from '@/features/shared/ui/components/ThemedText';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
import { useStyles } from '@/shared/hooks/theme/use-styles';

type ScreenTitleProps = {
  title: string;
  viewProps?: ViewProps;
  textProps?: ThemedTextProps;
};

const useComponentStyles = () =>
  useStyles((_) => ({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 32,
    },
  }));

export const ScreenTitle = ({ title, viewProps, textProps }: ScreenTitleProps) => {
  const styles = useComponentStyles();

  return (
    <ThemedView style={styles.titleContainer} {...viewProps}>
      <ThemedText type="title" {...textProps}>
        {title}
      </ThemedText>
    </ThemedView>
  );
};
