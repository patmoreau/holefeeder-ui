import React from 'react';
import { ViewProps } from 'react-native';
import { AppText, ThemedTextProps } from '@/features/shared/ui/components/AppText';
import { AppView } from '@/features/shared/ui/components/AppView';
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
    <AppView style={styles.titleContainer} {...viewProps}>
      <AppText variant="title" {...textProps}>
        {title}
      </AppText>
    </AppView>
  );
};
