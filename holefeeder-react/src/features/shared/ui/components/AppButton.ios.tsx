import { Button, ButtonVariant, Image } from '@expo/ui/swift-ui';
import { fixedSize, frame } from '@expo/ui/swift-ui/modifiers';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AppButtonVariant } from '@/features/shared/ui/components/AppButtonVariant';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';
import { Theme } from '@/types/theme/theme';

export type ButtonProps = {
  label?: string;
  icon?: AppIcons;
  variant?: AppButtonVariant;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: string;
  disabled?: boolean;
  testID?: string;
};

const variantMapping: Record<AppButtonVariant, ButtonVariant> = {
  primary: 'glassProminent',
  secondary: 'default',
  destructive: 'glassProminent',
  link: 'link',
};

const variantColor = (variant: AppButtonVariant, theme: Theme) => {
  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'secondary':
      return theme.colors.secondary;
    case 'destructive':
      return theme.colors.destructive;
    case 'link':
      return theme.colors.link;
    default:
      return theme.colors.secondary;
  }
};

export const AppButton = ({ label, icon, variant = AppButtonVariant.secondary, onPress = () => {}, style, disabled, testID }: ButtonProps) => {
  const { theme } = useTheme();
  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  const flatStyle = StyleSheet.flatten(style);
  const width = typeof flatStyle?.width === 'number' ? flatStyle.width : undefined;
  const height = typeof flatStyle?.height === 'number' ? flatStyle.height : undefined;

  if (!label && icon)
    return (
      <AppHost matchContents={false} style={style} testID={testID}>
        <Image systemName={icon} onPress={onPress} />
      </AppHost>
    );

  const modifiers = [];
  if (width !== undefined || height !== undefined) {
    modifiers.push(frame({ width, height, alignment: 'center' }));
  } else {
    modifiers.push(fixedSize({ horizontal: true, vertical: true }));
    modifiers.push(frame({ alignment: 'center' }));
  }

  return (
    <AppHost style={{ margin: 8 }} testID={testID}>
      <Button
        systemImage={icon}
        role={variant === AppButtonVariant.destructive ? 'destructive' : undefined}
        variant={variantMapping[variant]}
        color={variantColor(variant, theme)}
        onPress={handlePress}
        modifiers={modifiers}
      >
        {label}
      </Button>
    </AppHost>
  );
};
