import { ActivityIndicator, ActivityIndicatorProps, View, ViewProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLanguage } from '@/shared/hooks/use-language';

interface LoadingIndicatorProps extends Omit<ActivityIndicatorProps, 'size' | 'color'> {
  size?: 'small' | 'large';
  variant?: 'primary' | 'secondary';
  containerStyle?: ViewProps['style'];
  containerProps?: Omit<ViewProps, 'style'>;
  withBackground?: boolean;
}

const useLoadingIndicatorStyles = () =>
  useStyles((theme) => ({
    containerBase: {
      ...theme.styles.containers.center,
    },
    background: {
      backgroundColor: theme.colors.background,
    },
  }));

export const LoadingIndicator = ({
  size = 'large',
  variant = 'primary',
  containerStyle,
  containerProps,
  withBackground = true,
  accessibilityRole = 'progressbar',
  ...props
}: LoadingIndicatorProps) => {
  const { t } = useLanguage();
  const styles = useLoadingIndicatorStyles();
  const { theme } = useTheme();

  const variantColor = variant === 'primary' ? theme.colors.primary : theme.colors.secondary;
  const viewStyle = [styles.containerBase, withBackground && styles.background, containerStyle];

  return (
    <View style={viewStyle} {...containerProps}>
      <ActivityIndicator
        accessibilityLabel={t('common.loading')}
        accessibilityRole={accessibilityRole}
        size={size}
        color={variantColor}
        {...props}
      />
    </View>
  );
};
