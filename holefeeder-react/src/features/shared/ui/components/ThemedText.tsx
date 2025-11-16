import { Text, type TextProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'footnote';
};

const createStyles = (theme: Theme) => ({
  heading: {
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: 'center' as const,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.secondaryText,
    textAlign: 'center' as const,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});

export const ThemedText = ({ style, type = 'default', ...props }: ThemedTextProps) => {
  const styles = useStyles(createStyles);

  return <Text style={[type === 'default' && styles.body, type === 'title' && styles.heading, style]} {...props} />;
};
