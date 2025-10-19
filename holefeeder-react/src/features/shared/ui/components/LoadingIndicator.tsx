import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '@/shared/hooks/theme/use-theme';

interface LoadingIndicatorProps extends Omit<ActivityIndicatorProps, 'size' | 'color'> {
  size?: 'small' | 'large';
  variant?: 'primary' | 'secondary';
}

export const LoadingIndicator = ({ size = 'large', variant = 'primary', ...props }: LoadingIndicatorProps) => {
  const { theme } = useTheme();

  const getColor = () => (variant === 'primary' ? theme.colors.primary : theme.colors.secondary);

  return <ActivityIndicator size={size} color={getColor()} {...props} />;
};
