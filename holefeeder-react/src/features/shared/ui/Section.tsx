import React from 'react';
import { View, type ViewProps } from 'react-native';
import { ThemedText } from '@/features/shared/ui/components/ThemedText';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

type SectionProps = ViewProps & {
  title?: string;
};

const createStyles = (theme: Theme) => ({
  section: {
    ...theme.styles.containers.section,
    backgroundColor: theme.colors.secondaryBackground,
  },
  title: {
    ...theme.typography.secondary,
    paddingLeft: 36,
    textAlign: 'left' as const,
    color: `${theme.colors.secondaryText}3C`,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.separator,
  },
});

export const Section = ({ title, style, children, ...otherProps }: SectionProps) => {
  const styles = useStyles(createStyles);

  const childrenWithDividers = React.Children.toArray(children).reduce<React.ReactNode[]>((acc, child, index) => {
    acc.push(child);
    if (index < React.Children.count(children) - 1) {
      acc.push(<View key={`divider-${index}`} style={styles.divider} />);
    }
    return acc;
  }, []);

  return (
    <View style={{ flexDirection: 'column' }}>
      {title && (
        <ThemedText style={styles.title} variant="footnote">
          {title}
        </ThemedText>
      )}
      <View style={[styles.section, style]} {...otherProps}>
        {childrenWithDividers}
      </View>
    </View>
  );
};
