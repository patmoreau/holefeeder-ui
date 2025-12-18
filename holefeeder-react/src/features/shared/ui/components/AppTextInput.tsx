import { Pressable, TextInput, View } from 'react-native';
import { IconSymbol } from '@/features/shared/ui/components/IconSymbol';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppIcons } from '@/types/icons';
import { Theme } from '@/types/theme/theme';

export type AppTextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  icon?: AppIcons;
  onSubmit?: () => void;
};

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    minHeight: 40,
  },
  icon: {
    color: theme.colors.primary,
  },
});

export const AppTextInput = ({ placeholder, value, onChangeText, icon, onSubmit }: AppTextInputProps) => {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={styles.input} />
      {icon && onSubmit && (
        <Pressable accessibilityRole="button" onPress={onSubmit}>
          <IconSymbol name={icon} color={styles.icon.color} />
        </Pressable>
      )}
    </View>
  );
};
