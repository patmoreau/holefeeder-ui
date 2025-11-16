import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { Theme, ThemeMode } from '@/types/theme/theme';

const tkThemes: Record<ThemeMode, string> = {
  [ThemeMode.light]: tk.themeSwitcher.light,
  [ThemeMode.dark]: tk.themeSwitcher.dark,
  [ThemeMode.system]: tk.themeSwitcher.system,
};

const createStyles = (theme: Theme) => ({
  picker: {
    ...theme.styles.components.picker,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.separator,
  },
  pickerItem: {
    ...theme.styles.components.pickerItem,
    ...Platform.select({
      web: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      },
      default: {},
    }),
  },
});

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const styles = useStyles(createStyles);

  const handleThemeChange = async (theme: ThemeMode) => {
    await changeThemeMode(theme);
  };

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Picker style={styles.picker} selectedValue={themeMode} onValueChange={(code: ThemeMode) => handleThemeChange(code).then()}>
        {availableThemeModes.map((mode) => (
          <Picker.Item key={mode.code} label={t(tkThemes[mode.code])} value={mode} style={styles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
};
