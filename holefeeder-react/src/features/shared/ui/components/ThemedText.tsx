import { Text, type TextProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'footnote';
};

const useComponentStyles = () =>
  useStyles((theme) => ({
    heading: {
      ...theme.typography.title,
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.subtitle,
      color: theme.colors.secondaryText,
      textAlign: 'center',
    },
    body: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
  }));

export const ThemedText = ({ style, type = 'default', ...props }: ThemedTextProps) => {
  const styles = useComponentStyles();

  return <Text style={[type === 'default' && styles.body, type === 'title' && styles.heading, style]} {...props} />;
};
