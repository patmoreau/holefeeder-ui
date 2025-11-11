import { View, type ViewProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';

const useComponentStyles = () =>
  useStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.background,
    },
  }));

export const ThemedView = ({ style, ...otherProps }: ViewProps) => {
  const styles = useComponentStyles();

  return <View style={[styles.container, style]} {...otherProps} />;
};
