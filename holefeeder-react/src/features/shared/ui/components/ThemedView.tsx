import { View, type ViewProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
});

export const ThemedView = ({ style, ...otherProps }: ViewProps) => {
  const styles = useStyles(createStyles);

  return <View style={[styles.container, style]} {...otherProps} />;
};
