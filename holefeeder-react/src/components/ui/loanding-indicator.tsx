import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface LoadingIndicatorProps
  extends Omit<ActivityIndicatorProps, 'size' | 'color'> {
  size?: 'small' | 'large';
  variant?: 'primary' | 'secondary';
}

export const LoadingIndicator = ({
  size = 'large',
  variant = 'primary',
  ...props
}: LoadingIndicatorProps) => {
  const { theme, isDark } = useTheme();

  const getColor = () => {
    if (variant === 'primary') {
      return theme.colors.primary;
    }

    // Secondary variant adapts to the theme
    return isDark ? theme.colors.onSurface : theme.colors.onSurfaceVariant;
  };

  return <ActivityIndicator size={size} color={getColor()} {...props} />;
};
