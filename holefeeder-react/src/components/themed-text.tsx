import { Text, type TextProps } from 'react-native';
import { useTextStyles } from '@/hooks';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...props }: ThemedTextProps) {
  const { body } = useTextStyles();

  return <Text style={[type === 'default' ? body : undefined, style]} {...props} />;
}
