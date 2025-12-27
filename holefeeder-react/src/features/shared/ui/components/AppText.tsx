import { Text, type TextProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

export type ThemedTextProps = TextProps & {
  variant?: 'default' | 'largeTitle' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'footnote';
  adjustsFontSizeToFit?: boolean;
};

const createStyles = (theme: Theme) => ({
  default: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  largeTitle: {
    ...theme.typography.largeTitle,
    color: theme.colors.text,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  defaultSemiBold: {
    ...theme.typography.body,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text + '60',
  },
  footnote: {
    ...theme.typography.footnote,
    color: theme.colors.text + '60',
  },
  link: {
    color: theme.colors.link,
  },
});

export const AppText = ({ style, variant = 'default', adjustsFontSizeToFit, ...props }: ThemedTextProps) => {
  const styles = useStyles(createStyles);

  return (
    <Text
      style={[
        variant === 'default' && styles.default,
        variant === 'largeTitle' && styles.largeTitle,
        variant === 'title' && styles.title,
        variant === 'defaultSemiBold' && styles.defaultSemiBold,
        variant === 'subtitle' && styles.subtitle,
        variant === 'footnote' && styles.footnote,
        variant === 'link' && styles.link,
        style,
      ]}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={adjustsFontSizeToFit ? 0.5 : undefined}
      numberOfLines={adjustsFontSizeToFit ? 1 : undefined}
      {...props}
    />
  );
};
