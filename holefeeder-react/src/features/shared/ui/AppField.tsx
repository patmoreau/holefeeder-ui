import React from 'react';
import { type StyleProp, Text, View, type ViewProps, type ViewStyle } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}20`, // 20 is hex for ~12% opacity
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 8,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    alignItems: 'flex-end' as const,
    justifyContent: 'flex-end' as const,
    overflow: 'hidden' as const,
    marginLeft: 12,
  },
  largeContent: {
    width: '100%',
    alignSelf: 'flex-start' as const,
  },
});

export type FieldProps = {
  label?: string | React.ReactNode;
  icon: AppIcons;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'large';
} & Omit<ViewProps, 'children'>;

export const AppField = ({ label, icon, children, style, variant = 'default', ...otherProps }: FieldProps) => {
  const styles = useStyles(createStyles);
  const { theme } = useTheme();

  if (variant === 'large') {
    return (
      <View style={style} {...otherProps}>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <IconSymbol name={icon} size={24} color={theme.colors.primary} />
          </View>
          {label && <Text style={styles.label}>{label}</Text>}
        </View>
        <View style={styles.largeContent}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} {...otherProps}>
      <View style={styles.iconCircle}>
        <IconSymbol name={icon} size={24} color={theme.colors.primary} />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};
