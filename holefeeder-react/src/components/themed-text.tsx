import { Text, type TextProps } from 'react-native';
import { useTextStyles } from '@/hooks/theme/use-styles';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...props }: ThemedTextProps) {
  const { body, heading } = useTextStyles();

  return <Text style={[type === 'default' && body, type === 'title' && heading, style]} {...props} />;
}
