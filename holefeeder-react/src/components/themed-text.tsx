import { Text, type TextProps } from 'react-native';
import { useTextStyles } from '@/shared/hooks/theme/use-styles';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'footnote';
};

export function ThemedText({ style, type = 'default', ...props }: ThemedTextProps) {
  const { body, heading } = useTextStyles();

  return <Text style={[type === 'default' && body, type === 'title' && heading, style]} {...props} />;
}
