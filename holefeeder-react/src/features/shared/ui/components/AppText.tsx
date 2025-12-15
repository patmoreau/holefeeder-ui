import { Text, type TextProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

export type ThemedTextProps = TextProps & {
  variant?: 'default' | 'largeTitle' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'footnote';
};

const createStyles = (theme: Theme) => ({
  largeTitle: {
    ...theme.typography.largeTitle,
    color: theme.colors.text,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.secondaryText,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  footnote: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
});

export const AppText = ({ style, variant = 'default', ...props }: ThemedTextProps) => {
  const styles = useStyles(createStyles);

  return (
    <Text
      style={[
        variant === 'default' && styles.body,
        variant === 'title' && styles.title,
        variant === 'subtitle' && styles.subtitle,
        variant === 'footnote' && styles.footnote,
        style,
      ]}
      {...props}
    />
  );
};
