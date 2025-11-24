import { Button, ButtonVariant, Host } from '@expo/ui/swift-ui';
import { fixedSize } from '@expo/ui/swift-ui/modifiers';
import { StyleProp, ViewStyle } from 'react-native';
import { AppButtonVariant } from '@/features/shared/ui/components/AppButtonVariant';
import { AppIcons } from '@/types/icons';

export type ButtonProps = {
  label?: string;
  icon?: AppIcons;
  variant?: AppButtonVariant;
  onPress?: () => void;
  children?: string | React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const variantMapping: Record<AppButtonVariant, ButtonVariant> = {
  primary: 'glassProminent',
  secondary: 'default',
  destructive: 'glassProminent',
  link: 'link',
};

export const AppButton = ({ label, icon, variant, onPress = () => {}, style }: ButtonProps) => {
  return (
    <Host {...(!style ? { matchContents: true } : {})} style={style}>
      <Button
        systemImage={icon}
        role={variant === AppButtonVariant.destructive ? 'destructive' : undefined}
        variant={variantMapping[variant ?? AppButtonVariant.secondary]}
        onPress={onPress}
        modifiers={[fixedSize({ horizontal: true, vertical: true })]}
      >
        {label}
      </Button>
    </Host>
  );
};
