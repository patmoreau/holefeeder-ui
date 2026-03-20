import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AppTextInput } from '@/features/shared/ui/components/AppTextInput';
import { IconSymbol } from '@/features/shared/ui/components/IconSymbol';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';

type FilterFieldProps = {
  filter: string;
  setFilter: (filter: string) => void;
  onSubmit: () => void;
};

const createStyles = () => ({
  container: {
    flex: 1,
    width: '100%' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
});

export const FilterField = ({ filter, setFilter, onSubmit }: FilterFieldProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppTextInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t(tk.tagList.placeHolder)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <Pressable accessibilityRole="button" onPress={onSubmit} testID={'image-plus'}>
        <IconSymbol name={AppIcons.add} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
};
